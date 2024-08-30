from flask import Flask, request, jsonify, render_template, Response, stream_with_context
import json
import logging
import traceback
import re
import os
from dotenv import load_dotenv
import chromadb
from chromadb.config import Settings
import requests

app = Flask(__name__)

load_dotenv()

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

models = {}  # Dictionary to store loaded models

# Initialize Chroma DB
chroma_client = chromadb.PersistentClient(path=os.getenv("CHROMA_DB_PATH", "chroma_db"))
collection = chroma_client.get_or_create_collection("chat_history")

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
    try:
        response = requests.get('http://localhost:11434/api/tags')
        if response.status_code == 200:
            data = response.json()
            return jsonify([model['name'] for model in data['models']])
        else:
            return jsonify({"error": "Failed to fetch models from Ollama"}), 500
    except requests.RequestException as e:
        return jsonify({"error": f"Error connecting to Ollama: {str(e)}"}), 500

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    prompt = data['prompt']
    selected_model = data.get('model')
    system_message = data.get('system_message', '')
    chat_history = data.get('chat_history', [])

    formatted_prompt = format_prompt(system_message, prompt, chat_history)

    return Response(stream_with_context(generate_stream(selected_model, formatted_prompt)), content_type='application/json')

def extract_artifact(response):
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
        
        response = requests.post('http://localhost:11434/api/generate', 
                                 json={'model': model, 'prompt': prompt, 'stream': True},
                                 stream=True)
        
        for line in response.iter_lines():
            if line:
                data = json.loads(line)
                if 'response' in data:
                    chunk = data['response']
                    full_response += chunk
                    yield json.dumps({'token': chunk, 'full': full_response}, ensure_ascii=False) + '\n'
                if 'done' in data and data['done']:
                    break

        artifact_content = extract_artifact(full_response)
        if artifact_content:
            save_artifact(artifact_content)
            yield json.dumps({'type': 'artifact', 'data': artifact_content}, ensure_ascii=False) + '\n'

        save_to_chroma(prompt, full_response)

        logger.info("Generation completed successfully")
    except Exception as e:
        logger.error(f"Error during token generation: {str(e)}")
        logger.error(traceback.format_exc())
        yield json.dumps({'error': str(e)}, ensure_ascii=False) + '\n'

def save_artifact(artifact_content):
    artifacts_dir = os.getenv("ARTIFACTS_DIR", "artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)
    file_path = os.path.join(artifacts_dir, artifact_content['filename'])
    with open(file_path, 'w') as f:
        f.write(artifact_content['content'])

def save_to_chroma(prompt, response):
    collection.add(
        documents=[response],
        metadatas=[{"prompt": prompt}],
        ids=[str(collection.count() + 1)]
    )

@app.route('/model_status', methods=['GET'])
def model_status():
    try:
        response = requests.get('http://localhost:11434/api/tags')
        if response.status_code == 200:
            return jsonify({"status": "loaded"})
        else:
            return jsonify({"status": "not_loaded"})
    except requests.RequestException:
        return jsonify({"status": "not_loaded"})

@app.route('/chat_history', methods=['GET'])
def get_chat_history():
    try:
        results = collection.query(
            query_texts=[""],
            n_results=100
        )
        history = []
        for doc, metadata in zip(results['documents'][0], results['metadatas'][0]):
            history.append({
                'role': 'user',
                'content': metadata['prompt']
            })
            history.append({
                'role': 'assistant',
                'content': doc
            })
        return jsonify(history)
    except Exception as e:
        logger.error(f"Error retrieving chat history: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)