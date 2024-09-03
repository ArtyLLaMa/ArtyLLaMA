# ArtyLLama: AI-Powered Chat Interface for Open-Source LLMs

<img width="1183" alt="image" src="https://github.com/user-attachments/assets/5d6900b2-0abc-456a-8734-9394087b412b">

ArtyLLama is a React-based chat interface that integrates with multiple AI providers, including Ollama, OpenAI, and Anthropic, to provide an interactive AI chatbot experience. It features a dynamic UI with real-time message updates, code highlighting, HTML preview capabilities, and artifact rendering, including SVG support.

[![Activity Overview](https://img.shields.io/github/commit-activity/m/kroonen/artyllama)](https://github.com/kroonen/artyllama/graphs/commit-activity)
[![Open PRs](https://img.shields.io/github/issues-pr/kroonen/artyllama)](https://github.com/kroonen/artyllama/pulls)
[![Stars](https://img.shields.io/github/stars/kroonen/artyllama)](https://github.com/kroonen/artyllama/stargazers)
[![Contributors](https://img.shields.io/github/contributors/kroonen/artyllama)](https://github.com/kroonen/artyllama/graphs/contributors)

## Features

- Real-time chat interface with AI models powered by Ollama, OpenAI, and Anthropic
- Dynamic model selection from available AI models
- Code syntax highlighting for various programming languages
- HTML preview with interactive canvas and script support
- Responsive design with expandable preview panel
- Artifact rendering for various content types (HTML, SVG, code snippets, etc.)
- SVG rendering support for AI-generated vector graphics
- Error handling and loading indicators for a smooth user experience
- Server-side streaming of AI responses
- Customizable system messages
- Concurrent running of frontend and backend servers

## ArtyLLaMa Artifact Processing System

ArtyLLaMa employs a sophisticated artifact processing system to handle various types of AI-generated content. The following diagram illustrates the flow and processing steps for different artifact types:

![ArtyLLaMa Artifact Processing System](https://raw.githubusercontent.com/kroonen/artyllama/main/docs/artifact-processing-system.svg)

This diagram shows how ArtyLLaMa processes different types of artifacts from the initial LLM output to the final rendering in the user interface, highlighting the specialized handling for each artifact type.

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

## Contributing

Contributions to ArtyLLama are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Ollama, OpenAI, and Anthropic for providing AI backends
- React and Create React App for the frontend framework
- Tailwind CSS for styling
- DOMPurify for HTML sanitization
- Express.js for the backend server
- All contributors who have helped shape ArtyLLama

## Support

If you like this project, please give it a ⭐️ on GitHub!

For support, please open an issue on the GitHub repository.

---

Made with ❤️ by the ArtyLLama community.
