# ArtyLLama: AI-Powered Creative Platform for Interactive Content

![ArtyLLama Demo](artyllamaDemo.gif)

ArtyLLama is an evolving React-based platform that aims to enhance the creation of interactive content. By integrating with AI providers such as Ollama, OpenAI, and Anthropic, ArtyLLama explores ways to leverage Large Language Models (LLMs) for generating and iterating on creative projects through natural language interactions.

> [!NOTE]
> This project is under active development, and it is challenging to keep the documentation up-to-date while adding new functionalities, as I am currently working on this alone. Your understanding and patience are appreciated.

![GitHub repo size](https://img.shields.io/github/repo-size/ArtyLLama/ArtyLLaMA)
![Version](https://img.shields.io/github/package-json/v/ArtyLLama/ArtyLLaMA)

## 🚀 Features

- **Real-Time AI Chat Interface:**
  - Interact with AI models powered by Ollama, OpenAI, and Anthropic.
  
- **Dynamic Model Selection:**
  - Choose from available AI models to suit different project needs.

- **Code Syntax Highlighting:**
  - Enhanced readability with syntax highlighting for various programming languages.

- **HTML Preview with Interactive Canvas:**
  - Visualize HTML content with script support.

- **Responsive Design:**
  - A responsive UI with expandable preview panels.

- **Artifact Rendering:**
  - Render various content types, including HTML, SVG, and code snippets.

- **SVG Rendering Support:**
  - Display AI-created vector graphics.

- **3D Visualization Capabilities:**
  - Utilize Three.js for 3D visualizations and simulations.

- **Interactive Content Creation:**
  - Experiment with transforming AI-generated content into interactive experiences.

- **Natural Language Interface:**
  - Create and iterate on projects using natural language commands.

- **Error Handling and Loading Indicators:**
  - Implemented for a smoother user experience.

- **Server-Side Streaming:**
  - Stream AI responses from the server.

- **Customizable System Messages:**
  - Adjust system prompts to guide AI behavior.

- **Concurrent Server Operations:**
  - Run frontend and backend servers simultaneously.

- **User Authentication:**
  - JWT-based authentication for user registration and login.

- **Personalized Chat History:**
  - Store and retrieve messages based on user ID.

- **Chat History Management:**
  - Search and bookmark functionality in the chat history sidebar.

- **Secure Route Protection:**
  - Private route protection for chat-related features.

- **Dynamic Embedding Collections:**
  - Support for multiple embedding models with automatic collection creation.

- **Semantic Search:**
  - Cross-model semantic search capabilities in chat history.

## 🌟 Project Goals

ArtyLLama is an ongoing project that explores the potential of combining AI-generated content with interactive web experiences. We're working on bridging the gap between raw AI outputs and practical, engaging content creation.

Our current focus areas include:

- Simplifying complex content creation through natural language interactions
- Facilitating iterative development of projects
- Making AI-driven content creation more accessible to a wider audience
- Experimenting with ways to align AI-generated content with user intentions

## 🔧 ArtyLLama Artifact Processing System

ArtyLLama employs an artifact processing system to handle various types of AI-generated content:

![ArtyLLama Artifact Processing System](https://raw.githubusercontent.com/ArtyLLama/ArtyLLaMA/main/docs/artifact-processing-system.svg)

This system processes different types of artifacts, from text to 3D models, aiming to create a more interactive creative experience.

## 📋 Prerequisites

Before getting started, you'll need:

- **Docker:** For containerization and deployment.
- **Ollama:** Running locally or on an accessible server (for Ollama models).
- **API Keys:** For OpenAI and Anthropic (if using these providers).

## 🛠 Installation and Usage with Docker

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ArtyLLaMa/ArtyLLaMa.git
   cd ArtyLLaMA
   ```

2. **Build the Docker Image:**
   ```bash
   docker build -t artyllama:latest .
   ```

3. **Run the Docker Container:**
   ```bash
   docker run -p 3000:80 -p 3001:3001 \
   -e OLLAMA_API_URL=http://host.docker.internal:11434 \
   -e ANTHROPIC_API_KEY=your_anthropic_key \
   -e OPENAI_API_KEY=your_openai_key \
   artyllama:latest
   ```
   Replace `your_anthropic_key` and `your_openai_key` with your actual API keys if you plan to use these services.
   
   **Note for Linux users:** You may need to add the `--add-host` flag:
   ```bash
   docker run --add-host=host.docker.internal:host-gateway \
   -p 3000:80 -p 3001:3001 \
   -e OLLAMA_API_URL=http://host.docker.internal:11434 \
   -e ANTHROPIC_API_KEY=your_anthropic_key \
   -e OPENAI_API_KEY=your_openai_key \
   artyllama:latest
   ```

4. **Access the Application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - Swagger UI: http://localhost:3001/api-docs

## ⚙️ Configuration

ArtyLLama uses a configuration file for setup:

1. **Rename the Configuration File:**
   ```bash
   mv user_preferences.json.example user_preferences.json
   ```

2. **Edit `user_preferences.json` as needed:**
   - You can choose to connect to your local Ollama API for running models locally.
   - If connecting locally, consider selecting the lite system prompt for smaller models.

> [!WARNING]
> To use the new local or external embedding models, you need to have a Docker instance running with ChromaDB. Make sure to select the embedding model in the settings.

3. **Run ChromaDB Container in the Background:**
   ```bash
   docker run -d --name chromadb -p 8000:8000 chromadb/chroma:latest
   ```

## 🧑‍💻 Development Setup

For local development without Docker:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Create a .env File:**
   - In the root directory, create a `.env` file with your necessary environment variables.

3. **Start the Development Servers:**
   ```bash
   npm run dev
   ```

## 🤝 Contributing

Contributions to ArtyLLama are welcome! Please read our Contributing Guidelines for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under a modified MIT License - see the LICENSE file for more details.

## 🙏 Acknowledgments

- AI Providers: Ollama, OpenAI, and Anthropic
- Frameworks and Libraries: React, Create React App, Tailwind CSS, DOMPurify, Express.js, Three.js
- Community: All contributors and testers, including Jean-Sebastien

## 💬 Support

If you find ArtyLLama interesting, feel free to give it a ⭐️ on GitHub!

For support or to report issues, please open an issue on the GitHub repository.

© 2024 ArtyLLama Research Project | A core initiative of [Kroonen.ai](https://www.kroonen.ai), dedicated to advancing AI-driven creativity and computational research.
