# Troubleshooting Guide for ArtyLLaMa

This guide aims to help you resolve common issues you might encounter while setting up or using ArtyLLaMa. If you're experiencing problems, please follow these steps before reporting an issue.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Connection Problems](#connection-problems)
3. [AI Model Issues](#ai-model-issues)
4. [Frontend Issues](#frontend-issues)
5. [Backend Issues](#backend-issues)
6. [Performance Problems](#performance-problems)

## Installation Issues

If you're having trouble installing ArtyLLaMa:

1. Ensure you have the correct versions of Node.js (v14 or later) and npm (v6 or later) installed.
   - Check versions: `node --version` and `npm --version`
   - If outdated, update Node.js from [nodejs.org](https://nodejs.org/)

2. Make sure you've cloned the repository correctly:

```
git clone https://github.com/kroonen/artyllama.git cd artyllama
```

3. If `npm install` fails:
- Clear npm cache: `npm cache clean --force`
- Delete the `node_modules` folder and `package-lock.json` file
- Run `npm install` again

## Connection Problems

If you're unable to connect to AI providers:

1. Check your internet connection.

2. Verify that your `.env` file is set up correctly with valid API keys and URLs:

```
OLLAMA_API_URL=http://localhost:11434
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

3. For Ollama:
- Ensure Ollama is running locally or on the specified server
- Check if you can access the Ollama API directly (e.g., via curl)

4. For OpenAI and Anthropic:
- Verify that your API keys are valid and have sufficient credits

## AI Model Issues

If you're experiencing problems with AI models:

1. For Ollama models:
- Ensure the model is downloaded and available locally
- Check Ollama logs for any model-specific errors

2. For OpenAI and Anthropic models:
- Verify that you're using supported model names
- Check if there are any service outages reported by the providers

3. If a specific model isn't appearing in the selection:
- Restart the backend server
- Check the server logs for any errors related to model fetching

## Frontend Issues

For problems with the React frontend:

1. Clear your browser cache and reload the page.

2. Check the browser console for any JavaScript errors.

3. Ensure you're running the latest version of the code:

```
git pull origin main npm install npm start
```

4. If the UI is not updating properly, try disabling any ad-blockers or browser extensions.

## Backend Issues

If the backend server isn't working correctly:

1. Check if the server is running on the correct port (default is 3001).

2. Review the server logs for any error messages.

3. Ensure all required environment variables are set correctly.

4. Try restarting the server:

```
npm run server
```

## Performance Problems

If you're experiencing slow performance:

1. Check your internet connection speed.

2. For Ollama models, ensure your machine meets the recommended specifications.

3. If using OpenAI or Anthropic, be aware of rate limits that might affect performance.

4. Try closing other resource-intensive applications on your machine.

5. If the UI is lagging, consider using a more powerful device or a different browser.

---

If you've gone through this troubleshooting guide and are still experiencing issues, please open an issue on the [GitHub repository](https://github.com/kroonen/artyllama/issues) with detailed information about your problem, including:

- Steps to reproduce the issue
- Error messages (if any)
- Your operating system and browser version
- Versions of Node.js and npm
- Any relevant log outputs

We appreciate your patience and contributions to improving ArtyLLaMa!
