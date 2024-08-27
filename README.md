
![image](https://github.com/user-attachments/assets/1a6f595a-5aa7-4b05-84d8-c5d2f74948dd)


# ArtyLLaMA

ArtyLLaMA is an innovative chat interface that leverages the power of LLaMA.cpp and introduces an "Artifacts-like" feature for dynamic content generation and display.

## Features

- **LLaMA Integration**: Utilizes LLaMA.cpp for advanced language model capabilities.
- **Artifact Generation**: Dynamically creates and displays content artifacts during chat interactions.
- **HTML Preview**: Renders HTML artifacts in real-time for immediate visualization.
- **Multi-Model Support**: Allows selection from multiple available language models.
- **Responsive Design**: Built with Tailwind CSS for a mobile-friendly interface.
- **Dark Mode**: Default dark theme for comfortable viewing.

## Technical Stack

- **Frontend**: HTML5, Tailwind CSS, Alpine.js
- **Backend**: Python with Flask
- **AI Model**: LLaMA.cpp

## Key Components

1. **Chat Interface**: Real-time messaging with AI model responses.
2. **Artifact Panel**: Displays generated content with copy and preview functionalities.
3. **Model Selector**: Dropdown for choosing different LLaMA models.
4. **System Message**: Customizable prompt to set the AI's context and behavior.

## Getting Started

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Ensure LLaMA models are in the `/models` directory
4. Run the Flask app: `python app.py`
5. Access the interface at `http://localhost:5000`

## Future Enhancements

- Implement user authentication
- Add more artifact types (e.g., images, markdown)
- Improve error handling and model performance

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
