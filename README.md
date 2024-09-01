# (Arty)facts with open-source large language models for everyone!

ArtyLLaMa is a React-based chat interface that integrates with the Ollama API to provide an interactive AI chatbot experience. It features a dynamic UI with real-time message updates, code highlighting, and HTML preview capabilities.

<img width="1403" alt="image" src="https://github.com/user-attachments/assets/4d8b6207-5902-44a1-abcf-0d2ed03b422f">

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
   git clone https://github.com/yourusername/artyllama.git
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

## Main Components

- `LLMChatInterface`: The main component that handles the chat logic and UI.
- `SandboxedHtmlPreview`: A component that safely renders HTML content, including scripts and canvas elements.
- `PreviewPanel`: Displays code and rendered HTML content with toggle functionality.

## API Integration

The application integrates with the Ollama API for the following functionalities:

- Fetching available models
- Sending chat messages and receiving AI responses
- Streaming responses for real-time updates

## Security Considerations

- The application uses DOMPurify to sanitize HTML content before rendering.
- Scripts are allowed to run in a sandboxed iframe for interactive HTML previews.
- Ensure that you trust the source of AI-generated content, especially when rendering HTML and scripts.

## App Icons

This project now includes a comprehensive set of app icons for various platforms and devices:

- Favicon: Available in 16x16, 32x32, and 96x96 sizes
- Android: Icons ranging from 36x36 to 192x192
- Apple iOS: Icons ranging from 57x57 to 180x180, including the apple-touch-icon
- Microsoft: Icons for Windows devices, including sizes up to 310x310

These icons ensure that ArtyLLaMA looks great across different devices and platforms, enhancing the user experience whether accessed via web browsers or installed as a Progressive Web App.

To use these icons on your own deployment:
1. Ensure all icon files are in the `public` directory of your project.
2. The `manifest.json` file in the `public` directory has been updated to reference these new icons.
3. Update your `index.html` to include necessary link tags for different platforms.

For developers: If you're contributing to this project, please ensure any app-wide visual changes are reflected in these icons to maintain consistency.

## Contributing

Contributions to ArtyLLaMa are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Acknowledgments

- Ollama for providing the AI backend
- React and Create React App for the frontend framework
- Tailwind CSS for styling
- DOMPurify for HTML sanitization
