# ArtyLLama: AI-Powered Chat Interface for Open-Source LLMs

<img width="1347" alt="Screenshot 2024-09-16 at 8 02 59 AM" src="https://github.com/user-attachments/assets/6493cc10-561c-4e1c-b5a3-41924cb83ecd">


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

- Docker
- Ollama running locally or on an accessible server (for Ollama models)
- API keys for OpenAI and Anthropic (optional, if using these providers)

## Installation and Usage with Docker

1. Clone the repository:
   ```
   git clone https://github.com/kroonen/artyllama.git
   cd artyllama
   ```

2. Build the Docker image:
   ```
   docker build -t artyllama:latest .
   ```

3. Run the Docker container:
   ```
   docker run -p 3000:80 -p 3001:3001 \
     -e OLLAMA_API_URL=http://host.docker.internal:11434 \
     -e ANTHROPIC_API_KEY=your_anthropic_key \
     -e OPENAI_API_KEY=your_openai_key \
     artyllama:latest
   ```

   Replace `your_anthropic_key` and `your_openai_key` with your actual API keys if you want to use these services.

   Note: If you're running on Linux, you might need to add the `--add-host` flag:
   ```
   docker run --add-host=host.docker.internal:host-gateway \
     -p 3000:80 -p 3001:3001 \
     -e OLLAMA_API_URL=http://host.docker.internal:11434 \
     -e ANTHROPIC_API_KEY=your_anthropic_key \
     -e OPENAI_API_KEY=your_openai_key \
     artyllama:latest
   ```

4. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:3001`
   - Swagger UI: `http://localhost:3001/api-docs`

## Environment Variables

ArtyLLama uses the following environment variables:

- `OLLAMA_API_URL`: URL for the Ollama API (default: `http://host.docker.internal:11434`)
- `ANTHROPIC_API_KEY`: Your Anthropic API key (optional)
- `OPENAI_API_KEY`: Your OpenAI API key (optional)

These can be set when running the Docker container using the `-e` flag.

## Development Setup

For local development without Docker:

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with your environment variables.

3. Start the development servers:
   ```
   npm run dev
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
