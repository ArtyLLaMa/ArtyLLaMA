from flask import Flask, request, jsonify, render_template, Response, stream_with_context
import json
import logging
import traceback
import re

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

models = {} # Dictionary to store loaded models

def format_prompt(system_message, user_message, chat_history=[]):
    formatted_prompt = ""

    if system_message:
        formatted_prompt += f"<|start_header_id|>system<|end_header_id|>{system_message}<|eot_id|>"

    for message in chat_history:
        role = message['role']
        content = message['content']
        formatted_prompt += f"<|start_header_id|>{role}<|end_header_id|>{content}<|eot_id|>"

    formatted_prompt += f"<|start_header_id|>user<|end_header_id|>{user_message}<|eot_id|>"
    formatted_prompt += "<|start_header_id|>assistant<|end_header_id|>"

    return formatted_prompt

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/available_models')
def available_models():
    return jsonify(list(models.keys()))

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    prompt = data['prompt']
    selected_model = data.get('model')
    system_message = data.get('system_message', '')
    chat_history = data.get('chat_history', [])

    if selected_model not in models:
        return jsonify({"error": "Selected model not available"}), 400

    model = models[selected_model]

    formatted_prompt = format_prompt(system_message, prompt, chat_history)

    return Response(stream_with_context(generate_stream(model, formatted_prompt)), content_type='application/json')

def extract_artifact(response):
    # Extract content between triple backticks
    code_blocks = re.findall(r'```(?:(\w+))?\n([\s\S]+?)\n```', response)
    if code_blocks:
        language, content = code_blocks[0]
        filename = f"artifact.{language}" if language else "artifact.txt"
        return {"filename": filename, "content": content}
    return None

def generate_stream(model, prompt):
    try:
        logger.info(f"Generating with formatted prompt: {prompt[:100]}...")
        full_response = ""
        for token in model(prompt, max_tokens=8192, temperature=0.8, stream=True):
            chunk = token['choices'][0]['text']
            full_response += chunk
            yield json.dumps({'token': chunk, 'full': full_response}, ensure_ascii=False) + '\n'

        # Check if the response contains code or other artifact-worthy content
        artifact_content = extract_artifact(full_response)
        if artifact_content:
            yield json.dumps({'type': 'artifact', 'data': artifact_content}, ensure_ascii=False) + '\n'

        logger.info("Generation completed successfully")
    except Exception as e:
        logger.error(f"Error during token generation: {str(e)}")
        logger.error(traceback.format_exc())
        yield json.dumps({'error': str(e)}, ensure_ascii=False) + '\n'

@app.route('/model_status', methods=['GET'])
def model_status():
    return jsonify({"status": "loaded" if models else "not_loaded"})

if __name__ == '__main__':
    app.run(debug=True)
