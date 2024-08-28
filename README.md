# ArtyLLaMA 🦙🎨

<p align="center">
  <strong>Empowering Creativity with Open Source AI</strong>
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
  <a href="#installation">Installation</a> ·
  <a href="#usage">Usage</a> ·
  <a href="#roadmap">Roadmap</a> ·
  <a href="#contributing">Contributing</a> ·
  <a href="#license">License</a>
</p>

ArtyLLaMA is an innovative chat interface for Open Source Large Language Models, leveraging the power of LLaMA.cpp. It features dynamic content generation and display through an "Artifacts-like" system, making AI-assisted creativity more accessible and interactive.

## 🎥 Demo

<p align="center">
  <img src="https://github.com/user-attachments/assets/a94003f7-9af8-4591-bffe-97c4c59d2193" alt="ArtyLLaMA Interface" width="100%">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/ff63d059-3d2e-462b-844a-9ac71e8a3ab6" alt="ArtyLLaMA Calculator Demo" width="100%">
</p>

<p align="center">
  <em>ArtyLLaMA in action: Running LLaMa 3.1 Instruct 8b model (Q8), generating a calculator and a website</em>
</p>

## ✨ Features

- 🧠 **LLaMA Integration**: Seamless support for LLaMa.cpp via the llama-cpp-python package
- 🎨 **Dynamic Artifact Generation**: Create and display content artifacts during chat interactions
- 🖥️ **Real-time HTML Preview**: Instantly visualize HTML artifacts
- 🔄 **Multi-Model Support**: Choose from multiple language models in the `/models` folder
- 📱 **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- 🌙 **Dark Mode**: Easy on the eyes with a default dark theme
- 🚀 **Local Inference**: Run models locally for privacy and customization

## 🛠️ Technical Stack

- **Frontend**: HTML5, Tailwind CSS, Alpine.js
- **Backend**: Python with Flask
- **Inference**: LLaMA.cpp (local machine inference)

## 🧩 Key Components

1. 💬 **Interactive Chat Interface**: Real-time messaging with AI model responses
2. 🖼️ **Artifact Panel**: Display generated content with copy and preview functionalities
3. 🔽 **Model Selector**: Easy switching between different LLaMA models
4. 📝 **Customizable System Messages**: Set the AI's context and behavior

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Git
- Compatible LLaMA models in .GGUF format ([Available on Hugging Face 🤗](https://huggingface.co/kroonen))

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

4. Place your LLaMA models in the `/models` directory.

5. Configure `app.py` for your hardware (currently optimized for M3 Max with MPS architecture).

6. Launch the application:
   ```sh
   python app.py
   ```

7. Open your browser and navigate to `http://localhost:5000`.


## 🗺️ Roadmap

- [x] Display generated artifacts in the chatbox as clickable objects
- [ ] Support additional artifact types (images, markdown)
- [ ] Integrate more local providers (ollama, mlx) and external providers (OpenAI, Groq, Anthropic)
- [ ] Enhance error handling and model performance / display stats
- [ ] Implement user authentication and session management
- [ ] Create a public API for ArtyLLaMA

See the [open issues](https://github.com/kroonen/ArtyLLaMA/issues) for a full list of proposed features and known issues.

## 🤝 Contributing

We welcome contributions to ArtyLLaMA! Our goal is to make interactions between humans and large language models more natural, empowering open-source models like LLaMa, PHI, and Gemma. Here's how you can contribute:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**TO DO: Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.**

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

rob - [@rob_x_ai](https://x.com/rob_x_ai) / rob@artyllama.com

Project Link: [artyllama.com](https://github.com/kroonen/ArtyLLaMA)

## 🙏 Acknowledgments

- [LLaMA.cpp](https://github.com/ggerganov/llama.cpp) for the incredible work!

---

<p align="center">Made with ❤️ by the ArtyLLaMA community</p>
