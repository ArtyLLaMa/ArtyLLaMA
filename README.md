# ArtyLLaMA 🦙🎨

<p align="center">
  <strong>Empowering AI Creativity in the Open Source Community</strong>
</p>

<p align="center">
  <a href="https://github.com/kroonen/ArtyLLaMA/stargazers"><img src="https://img.shields.io/github/stars/kroonen/ArtyLLaMA" alt="Stars Badge"/></a>
  <a href="https://github.com/kroonen/ArtyLLaMA/network/members"><img src="https://img.shields.io/github/forks/kroonen/ArtyLLaMA" alt="Forks Badge"/></a>
  <a href="https://github.com/kroonen/ArtyLLaMA/pulls"><img src="https://img.shields.io/github/issues-pr/kroonen/ArtyLLaMA" alt="Pull Requests Badge"/></a>
  <a href="https://github.com/kroonen/ArtyLLaMA/issues"><img src="https://img.shields.io/github/issues/kroonen/ArtyLLaMA" alt="Issues Badge"/></a>
  <a href="https://github.com/kroonen/ArtyLLaMA/blob/master/LICENSE"><img src="https://img.shields.io/github/license/kroonen/ArtyLLaMA" alt="License Badge"/></a>
</p>

<p align="center">
  <a href="#demo">View Demo</a> ·
  <a href="#features">Features</a> ·
  <a href="#technical-stack">Technical Stack</a> ·
  <a href="#key-components">Key Components</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#roadmap">Roadmap</a> ·
  <a href="#contributing">Contributing</a> ·
  <a href="#license">License</a>
</p>

ArtyLLaMA is an innovative chat interface for Open Source Large Language Models, now leveraging the power of Ollama. It features dynamic content generation and display through an "Artifacts-like" system, making AI-assisted creativity more accessible and interactive.

## 🎥 Demo

<p align="center">
  <img src="https://github.com/user-attachments/assets/2cc77193-ee20-4bf1-be81-c64ec075c0f9" alt="ArtyLLaMA Interface" width="100%">
</p>

<p align="center">
  <em>ArtyLLaMA in action: Using Ollama to run various models, generating an entire website in one shot!</em>
</p>

## ✨ Features

- 🦙 **Ollama Integration**: Seamless support for multiple language models via Ollama
- 🎨 **Dynamic Artifact Generation**: Create and display content artifacts during chat interactions
- 🖥️ **Real-time HTML Preview**: Instantly visualize HTML artifacts
- 🔄 **Multi-Model Support**: Choose from multiple language models available through Ollama
- 📱 **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- 🌙 **Dark Mode**: Easy on the eyes with a default dark theme
- 🚀 **Local Inference**: Run models locally for privacy and customization

## 🛠️ Technical Stack

- **Frontend**: HTML5, Tailwind CSS, Alpine.js
- **Backend**: Python with Flask
- **Inference**: Ollama (local machine inference)

## 🧩 Key Components

1. 💬 **Interactive Chat Interface**: Real-time messaging with AI model responses
2. 🖼️ **Artifact Panel**: Display generated content with copy and preview functionalities
3. 🔽 **Model Selector**: Easy switching between different Ollama models
4. 📝 **Customizable System Messages**: Set the AI's context and behavior

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Git
- Ollama installed on your system ([Ollama Installation Guide](https://github.com/ollama/ollama))

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/kroonen/ArtyLLaMA
   cd ArtyLLaMA
   ```

2. Create and activate a Python virtual environment:
   ```sh
   conda create -n ArtyLLaMa python=3.11
   conda activate ArtyLLaMa
   ```

3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```

4. Ensure Ollama is running on your system.

5. Launch the application:
   ```sh
   python app.py
   ```

6. Open your browser and navigate to `http://localhost:5000` to start creating.

## 🗺️ Roadmap

- [x] Display generated artifacts in the chatbox as clickable objects
- [x] Integrate Ollama for multi-model support with models selector
- [ ] Support additional artifact types (images, markdown)
- [ ] Integrate more providers (OpenAI, Groq, Anthropic,...)
- [ ] Enhance error handling and model performance / display stats

See the [open issues](https://github.com/kroonen/ArtyLLaMA/issues) for a full list of proposed features and known issues.

## 🤝 Contributing

We welcome contributions to ArtyLLaMA! Our goal is to make interactions between humans and large language models more natural. Here's how you can contribute:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

rob - [@rob_x_ai](https://x.com/rob_x_ai) / rob@artyllama.com

Project Link: [artyllama.com](https://github.com/kroonen/ArtyLLaMA)

## 🙏 Acknowledgments

- [Ollama](https://github.com/ollama/ollama) for providing an excellent backend to run various LLMs locally
- [LLaMA.cpp](https://github.com/ggerganov/llama.cpp) for the incredible foundational work

---

<p align="center">Made with ❤️ by the ArtyLLaMA community</p>
