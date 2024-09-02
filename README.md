![apple-icon-180x180](https://github.com/user-attachments/assets/2ea7b0d1-d41d-41c8-a382-145829a50251)

# (Arty)facts with open-source large language models for everyone!

ArtyLLaMa is a React-based chat interface that integrates with multiple AI providers including Ollama, OpenAI, and Anthropic to provide an interactive AI chatbot experience. It features a dynamic UI with real-time message updates, code highlighting, HTML preview capabilities, and artifact rendering.

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

- Real-time chat interface with AI models powered by Ollama, OpenAI, and Anthropic
- Dynamic model selection from available AI models
- Code syntax highlighting for various programming languages
- HTML preview with interactive canvas and script support
- Responsive design with expandable preview panel
- Artifact rendering for various content types (HTML, SVG, code snippets, etc.)
- Error handling and loading indicators for a smooth user experience
- Server-side streaming of AI responses
- Customizable system messages
- Concurrent running of frontend and backend servers

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (v6 or later)
- Ollama running locally or on an accessible server (for Ollama models)
- API keys for OpenAI and Anthropic (if using these providers)

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
   OLLAMA_API_URL=http://localhost:11434
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```
   Replace the URLs and API keys with your actual values.

## Usage

To start both the frontend and backend servers concurrently:

```
npm run dev
```

This will start the React development server on `http://localhost:3000` and the backend server on `http://localhost:3001`.

To start only the frontend:

```
npm start
```

To start only the backend:

```
npm run server
```

## Project Structure

```
src
├── app.js
├── components
│   ├── ArtifactRenderer.js
│   ├── ChatArea.js
│   ├── ErrorMessage.js
│   ├── ExpandedPreviewModal.js
│   ├── Header.js
│   ├── LLMChatInterface.js
│   ├── ModelManagement.js
│   ├── PreviewPanel.js
│   ├── SandboxedHtmlPreview.js
│   ├── SettingsModal.js
│   ├── Sidebar.js
│   └── useChat.js
├── index.js
└── styles
    └── tailwind.css
server.js
```

## API Integration

The application integrates with multiple AI providers:

- Ollama API for local models
- OpenAI API for GPT models
- Anthropic API for Claude models

Functionalities include:
- Fetching available models
- Sending chat messages and receiving AI responses
- Streaming responses for real-time updates
- Artifact creation and rendering

## Security Considerations

- The application uses DOMPurify to sanitize HTML content before rendering.
- Scripts are allowed to run in a sandboxed iframe for interactive HTML previews.
- Ensure that you trust the source of AI-generated content, especially when rendering HTML and scripts.
- API keys are stored in environment variables and should never be exposed in the frontend code.

## Contributing

Contributions to ArtyLLaMa are welcome. Please ensure you follow the existing code style and structure when submitting pull requests. Here are some ways you can contribute:

- Reporting bugs
- Suggesting enhancements
- Writing documentation
- Submitting pull requests

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Troubleshooting

If you encounter any issues:

1. Ensure all dependencies are installed: `npm install`
2. Check that your `.env` file is correctly set up with valid API keys
3. Make sure Ollama is running if you're using local models
4. Clear your browser cache and restart the servers

For more detailed troubleshooting, refer to our [Troubleshooting Guide](TROUBLESHOOTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Ollama, OpenAI, and Anthropic for providing AI backends
- React and Create React App for the frontend framework
- Tailwind CSS for styling
- DOMPurify for HTML sanitization
- Express.js for the backend server
- Concurrently for running multiple npm scripts
- A special shout-out to Dependabot, our tireless digital guardian. While it may not write code, it certainly keeps our dependencies in check with the enthusiasm of a caffeinated squirrel. 🤖🎉

## Support

If you like this project, please give it a ⭐️ on GitHub!

For support, please open an issue on the GitHub repository.
