
![apple-icon-180x180](https://github.com/user-attachments/assets/2ea7b0d1-d41d-41c8-a382-145829a50251)

# (Arty)facts with open-source large language models for everyone!

ArtyLLaMa is a React-based chat interface that integrates with the Ollama API to provide an interactive AI chatbot experience. It features a dynamic UI with real-time message updates, code highlighting, and HTML preview capabilities.

<img width="1403" alt="image" src="https://github.com/user-attachments/assets/4d8b6207-5902-44a1-abcf-0d2ed03b422f">

## Project Status

ArtyLLaMa is in its early stages and under active development. We welcome contributions and feedback from the community!

[![Activity Overview](https://img.shields.io/github/commit-activity/m/kroonen/artyllama)](https://github.com/kroonen/artyllama/graphs/commit-activity)
[![Open PRs](https://img.shields.io/github/issues-pr/kroonen/artyllama)](https://github.com/kroonen/artyllama/pulls)
[![Stars](https://img.shields.io/github/stars/kroonen/artyllama)](https://github.com/kroonen/artyllama/stargazers)
[![Contributors](https://img.shields.io/github/contributors/kroonen/artyllama)](https://github.com/kroonen/artyllama/graphs/contributors)

![GitHub Contributors Image](https://contrib.rocks/image?repo=kroonen/artyllama)

### Star History

[![Star History Chart](https://api.star-history.com/svg?repos=kroonen/artyllama&type=Date)](https://star-history.com/#kroonen/artyllama&Date)

## Features

- Real-time chat interface with AI models powered by Ollama
- Dynamic model selection from available Ollama models
- Code syntax highlighting for various programming languages
- HTML preview with interactive canvas and script support
- Responsive design with expandable preview panel
- Error handling and loading indicators for a smooth user experience

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (v6 or later)
- Ollama running locally or on an accessible server

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/kroonen/artyllama.git
   cd artyllama
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```
   REACT_APP_OLLAMA_API_URL=http://localhost:11434
   ```
   Replace the URL with your Ollama server address if it's not running locally.

## Usage

To start the development server:

```
npm start
```

The application will be available at `http://localhost:3000`.

## API Integration

The application integrates with the Ollama API for the following functionalities:

- Fetching available models
- Sending chat messages and receiving AI responses
- Streaming responses for real-time updates

## Security Considerations

- The application uses DOMPurify to sanitize HTML content before rendering.
- Scripts are allowed to run in a sandboxed iframe for interactive HTML previews.
- Ensure that you trust the source of AI-generated content, especially when rendering HTML and scripts.

## Contributing

Contributions to ArtyLLaMa are welcome.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Acknowledgments

- Ollama for providing the AI backend
- React and Create React App for the frontend framework
- Tailwind CSS for styling
- DOMPurify for HTML sanitization
- A special shout-out to Dependabot, our tireless digital guardian. While it may not write code, it certainly keeps our dependencies in check with the enthusiasm of a caffeinated squirrel. 🤖🎉
