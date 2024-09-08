const express = require("express");
const app = express();
const Anthropic = require("@anthropic-ai/sdk");
const axios = require("axios");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");
const ArtifactManager = require("./src/utils/ArtifactManager");
const fs = require("fs").promises;
const { exec } = require("child_process");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const rateLimit = require('express-rate-limit');

const USER_PREFERENCES_FILE = path.join(__dirname, "user_preferences.json");

dotenv.config();

async function initializeUserPreferences() {
  const defaultPreferences = {
    savedMessages: [],
    lastUsedModel: "",
    lastUsedSystemMessage: "You are a helpful AI assistant.",
    apiKeys: {
      OLLAMA_API_URL: "",
      ANTHROPIC_API_KEY: "",
      OPENAI_API_KEY: ""
    }
  };

  try {
    await fs.access(USER_PREFERENCES_FILE);
    console.log("User preferences file already exists.");
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log("Creating default user preferences file...");
      await fs.writeFile(USER_PREFERENCES_FILE, JSON.stringify(defaultPreferences, null, 2));
      console.log("Default user preferences file created successfully.");
    } else {
      console.error("Error checking user preferences file:", error);
    }
  }
}

// Call this function when your server starts
initializeUserPreferences();

let anthropic;
let openai;
let ollamaApiUrl;

async function initializeApiClients() {
  try {
    const data = await fs.readFile(USER_PREFERENCES_FILE, "utf8");
    const preferences = JSON.parse(data);
    const apiKeys = preferences.apiKeys || {};

    if (apiKeys.ANTHROPIC_API_KEY && apiKeys.ANTHROPIC_API_KEY !== '********') {
      anthropic = new Anthropic.Anthropic({
        apiKey: apiKeys.ANTHROPIC_API_KEY,
      });
    } else {
      console.log("Valid Anthropic API key not found. Anthropic features will be disabled.");
      anthropic = null;
    }

    if (apiKeys.OPENAI_API_KEY && apiKeys.OPENAI_API_KEY !== '********') {
      openai = new OpenAI({
        apiKey: apiKeys.OPENAI_API_KEY,
      });
    } else {
      console.log("Valid OpenAI API key not found. OpenAI features will be disabled.");
      openai = null;
    }

    ollamaApiUrl = apiKeys.OLLAMA_API_URL || process.env.OLLAMA_API_URL;
  } catch (error) {
    console.error("Error initializing API clients:", error);
  }
}

(async function () {
  const { default: chalk } = await import("chalk");
  const os = require("os");

  console.log(chalk.blue(`
                    .+%%*:            .*%%*.
                   .@@#+@@-          :@@**@@.
                   *@%  +@@    ..    %@*  %@#
                   %@+  .@@*#@@@@@@#*@@:  +@@
                   %@+  .@@@*-:...-*@@@:  +@@
                   #@@@@@@#.         *@@@@@@%
                 :%@@+-:::            :::-+%@%-
                =@@=                        =@@=
               .@@=                          -@@:
               =@@    :+=   -+*##*+-   =+-    @@=
               -@@:   %@@.+@*-....-*@+.%@@   .@@-
                #@%:   . +@:  :##:  :@+ .   :%@#
                :@@*     +@:   ++   .@*     *@@:
                %@#       +@#=----=*@+       *@%
               .@@-         :======:         :@@:
               :@@:                          :@@:
                @@*                          +@@
                :@@*                        *@@:
                .@@*                        +@@.
                *@%                          %@*
                %@*                          +@%
                *%#                          *%#
                     Welcome to ArtyLLaMa!
  Report bugs to https://github.com/kroonen/ArtyLLaMa/issues
  `));

  console.log(chalk.cyan("ArtyLLaMa Server Starting..."));

  await initializeApiClients();

  function combineConsecutiveMessages(messages) {
    return messages.reduce((acc, msg, index) => {
      const { role, content } = msg;
      if (index === 0 || role !== acc[acc.length - 1].role) {
        acc.push({ role, content });
      } else {
        acc[acc.length - 1].content += "\n" + content;
      }
      return acc;
    }, []);
  }

  const app = express();
  app.set('trust proxy', 1); // Adjust this based on your environment

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipFailedRequests: true, // Skip limiting if request fails
    keyGenerator: (req, res) => req.ip, // Use the request IP as key
  });

  app.use(apiLimiter);

  app.use(express.json());

  const artifactManager = new ArtifactManager();

  // Swagger definition
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "ArtyLLaMa API",
        version: "0.1.0",
        description: "API for ArtyLLaMa, an AI-powered chat interface for interacting with open-source language models",
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3001}`,
          description: "Development server (local)",
        },
        {
          url: `http://{networkIP}:${process.env.PORT || 3001}`,
          description: "Development server (network)",
          variables: {
            networkIP: {
              default: "{networkIP}",
              description: "Your computer's IP address on the local network",
            },
          },
        },
      ],
    },
    apis: ["./server.js"], // Path to the API docs
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  /**
   * @swagger
   * /api/models:
   *   get:
   *     summary: Retrieve available AI models
   *     description: Fetches a list of available AI models from various providers
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 models:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       name:
   *                         type: string
   *       500:
   *         description: Server error
   */
  app.get("/api/models", async (req, res) => {
    try {
      let allModels = [];

      if (ollamaApiUrl) {
        try {
          const ollamaResponse = await axios.get(`${ollamaApiUrl}/api/tags`);
          allModels = [...allModels, ...ollamaResponse.data.models];
        } catch (error) {
          console.error("Error fetching Ollama models:", error);
        }
      } else {
        console.log("OLLAMA_API_URL is not set. Skipping Ollama models fetch.");
      }

      if (anthropic) {
        const anthropicModels = [
          "claude-3-opus-20240229",
          "claude-3-sonnet-20240229",
          "claude-3-haiku-20240307",
        ];
        allModels = [...allModels, ...anthropicModels.map(name => ({ name }))];
      } else {
        console.log("ANTHROPIC_API_KEY is not set. Skipping Anthropic models.");
      }

      if (openai) {
        try {
          const openaiModelsResponse = await openai.models.list();
          const chatModels = openaiModelsResponse.data.filter(model =>
            model.id.includes('gpt') || model.id.includes('text-davinci')
          );
          allModels = [...allModels, ...chatModels.map(model => ({ name: model.id }))];
        } catch (error) {
          console.error("Error fetching OpenAI models:", error);
        }
      } else {
        console.log("OPENAI_API_KEY is not set. Skipping OpenAI models.");
      }

      res.json({ models: allModels });
    } catch (error) {
      console.error("Error in /api/models endpoint:", error);
      let errorMessage = "Failed to fetch models";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      res.status(500).json({ error: errorMessage });
    }
  });

  /**
   * @swagger
   * /api/chat:
   *   post:
   *     summary: Send a chat message
   *     description: Send a message to the selected AI model and receive a response
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - model
   *               - messages
   *             properties:
   *               model:
   *                 type: string
   *               messages:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     role:
   *                       type: string
   *                     content:
   *                       type: string
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           text/event-stream:
   *             schema:
   *               type: string
   *       400:
   *         description: Bad request
   *       500:
   *         description: Server error
   */
  app.post("/api/chat", async (req, res) => {
    const { model, messages } = req.body;

    if (!model) {
      return res.status(400).json({ error: "Model not specified" });
    }

    const combinedMessages = combineConsecutiveMessages(messages);

    try {
      if (model.startsWith("claude-")) {
        if (!anthropic) {
          return res.status(500).json({
            error: "Anthropic API error",
            message: "Anthropic API key is not configured.",
          });
        }
        // Anthropic API call
        try {
          const systemMessage = combinedMessages.find(
            (msg) => msg.role === "system",
          );
          let userMessages = combinedMessages.filter(
            (msg) => msg.role !== "system",
          );

          const response = await anthropic.messages.create({
            model: model,
            max_tokens: 4096,
            system: systemMessage ? systemMessage.content : undefined,
            messages: userMessages,
          });

          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          });

          const words = response.content[0].text.split(" ");
          for (const word of words) {
            res.write(
              `data: ${JSON.stringify({
                content: word + " ",
                provider: "anthropic",
              })}\n\n`,
            );

            await new Promise((resolve) => setTimeout(resolve, 50));
          }

          res.write(
            `data: ${JSON.stringify({
              fullContent: response.content[0].text,
              provider: "anthropic",
              usage: response.usage,
            })}\n\n`,
          );

          res.write("data: [DONE]\n\n");
          res.end();

          artifactManager.addArtifact({
            type: "chat",
            model: model,
            content: response.content[0].text,
          });
        } catch (error) {
          console.error("Anthropic API error:", error);
          res.status(500).json({
            error: "Anthropic API error",
            message: "An error occurred while processing your request. Please try again later.",
            details: error.message,
          });
        }
      } else if (model.startsWith("gpt-")) {
        if (!openai) {
          return res.status(500).json({
            error: "OpenAI API error",
            message: "OpenAI API key is not configured.",
          });
        }
        // OpenAI API call
        try {
          const stream = await openai.chat.completions.create({
            model: model,
            messages: combinedMessages,
            max_tokens: 4096,
            stream: true,
          });

          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          });

          let fullContent = "";
          for await (const chunk of stream) {
            if (chunk.choices[0]?.delta?.content) {
              const chunkContent = chunk.choices[0].delta.content;
              fullContent += chunkContent;

              res.write(
                `data: ${JSON.stringify({
                  content: chunkContent,
                  provider: "openai",
                })}\n\n`,
              );
            }
          }

          res.write(
            `data: ${JSON.stringify({
              content: "[DONE]",
              provider: "openai",
              fullContent: fullContent,
            })}\n\n`,
          );
          res.end();

          artifactManager.addArtifact({
            type: "chat",
            model: model,
            content: fullContent,
          });
        } catch (error) {
          console.error("OpenAI API error:", error);
          res.status(500).json({
            error: "OpenAI API error",
            message: "An error occurred while processing your request. Please try again later.",
            details: error.message,
          });
        }
      } else {
        // Ollama API call
        if (!ollamaApiUrl) {
          return res.status(500).json({
            error: "Ollama API error",
            message: "Ollama API URL is not configured.",
          });
        }
        const ollamaUrl = `${ollamaApiUrl}/api/chat`;
        console.log("Sending request to Ollama:", ollamaUrl);
        console.log(
          "Request payload:",
          JSON.stringify({ model, messages: combinedMessages, stream: true }),
        );

        try {
          const response = await axios.post(
            ollamaUrl,
            {
              model,
              messages: combinedMessages,
              stream: true,
            },
            {
              responseType: "stream",
            },
          );

          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          });

          let fullContent = "";

          response.data.on("data", (chunk) => {
            const lines = chunk
              .toString()
              .split("\n")
              .filter((line) => line.trim() !== "");
            for (const line of lines) {
              try {
                const parsedLine = JSON.parse(line);
                if (parsedLine.message && parsedLine.message.content) {
                  fullContent += parsedLine.message.content;
                  res.write(
                    `data: ${JSON.stringify({
                      content: parsedLine.message.content,
                      provider: "ollama",
                    })}\n\n`,
                  );
                }
                if (parsedLine.done) {
                  res.write(
                    `data: ${JSON.stringify({
                      content: "[DONE]",
                      provider: "ollama",
                      fullContent: fullContent,
                    })}\n\n`,
                  );
                  res.end();

                  artifactManager.addArtifact({
                    type: "chat",
                    model: model,
                    content: fullContent,
                  });
                }
              } catch (parseError) {
                console.error("Error parsing Ollama chunk:", parseError);
              }
            }
          });

          response.data.on("end", () => {
            if (!res.writableEnded) {
              res.write(
                `data: ${JSON.stringify({
                  content: "[DONE]",
                  provider: "ollama",
                  fullContent: fullContent,
                })}\n\n`,
              );
              res.end();

              artifactManager.addArtifact({
                type: "chat",
                model: model,
                content: fullContent,
              });
            }
          });
        } catch (error) {
          console.error("Ollama API error:", error);
          res.status(500).json({
            error: "Ollama API error",
            message: "An error occurred while processing your request. Please try again later.",
            details: error.message,
          });
        }
      }
    } catch (error) {
      console.error("API error:", error);
      res.status(500).json({ error: "Failed to call API", details: error.message });
    }
  });

  /**
   * @swagger
   * /api/user-preferences:
   *   get:
   *     summary: Get user preferences
   *     description: Retrieves the user preferences from the server
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 savedMessages:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       name:
   *                         type: string
   *                       content:
   *                         type: string
   *                 lastUsedModel:
   *                   type: string
   *                 lastUsedSystemMessage:
   *                   type: string
   *                 apiKeys:
   *                   type: object
   *                   properties:
   *                     OLLAMA_API_URL:
   *                       type: string
   *                     ANTHROPIC_API_KEY:
   *                       type: string
   *                     OPENAI_API_KEY:
   *                       type: string
   *       500:
   *         description: Server error
   */
  app.get("/api/user-preferences", async (req, res) => {
    try {
      const data = await fs.readFile(USER_PREFERENCES_FILE, "utf8");
      const preferences = JSON.parse(data);

      // Mask API keys for security
      if (preferences.apiKeys) {
        Object.keys(preferences.apiKeys).forEach(key => {
          if (preferences.apiKeys[key]) {
            preferences.apiKeys[key] = '********';
          }
        });
      }

      res.json(preferences);
    } catch (error) {
      if (error.code === "ENOENT") {
        res.json({});
      } else {
        console.error("Error reading user preferences:", error);
        res.status(500).json({ error: "Failed to read user preferences" });
      }
    }
  });

  /**
   * @swagger
   * /api/user-preferences:
   *   post:
   *     summary: Save user preferences
   *     description: Saves the user preferences to the server
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               savedMessages:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     name:
   *                       type: string
   *                     content:
   *                       type: string
   *               lastUsedModel:
   *                 type: string
   *               lastUsedSystemMessage:
   *                 type: string
   *               apiKeys:
   *                 type: object
   *                 properties:
   *                   OLLAMA_API_URL:
   *                     type: string
   *                   ANTHROPIC_API_KEY:
   *                     type: string
   *                   OPENAI_API_KEY:
   *                     type: string
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       500:
   *         description: Server error
   */
  app.post("/api/user-preferences", async (req, res) => {
    try {
      const currentPreferences = JSON.parse(await fs.readFile(USER_PREFERENCES_FILE, "utf8"));
      const newPreferences = req.body;
  
      // Preserve existing API keys if new ones are not provided
      if (newPreferences.apiKeys) {
        Object.keys(newPreferences.apiKeys).forEach(key => {
          if (newPreferences.apiKeys[key] === '********') {
            newPreferences.apiKeys[key] = currentPreferences.apiKeys[key] || '';
          }
        });
      }
  
      await fs.writeFile(
        USER_PREFERENCES_FILE,
        JSON.stringify(newPreferences, null, 2)
      );
      res.json({ message: "User preferences saved successfully" });
  
      // Reinitialize API clients with new keys
      await initializeApiClients();
    } catch (error) {
      console.error("Error saving user preferences:", error);
      res.status(500).json({ error: "Failed to save user preferences" });
    }
  });

  // Function to execute the update script
  function executeUpdateScript() {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, "update_ollama_models.sh");
      execFile('bash', [scriptPath], (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing update script: ${error}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.error(`Script stderr: ${stderr}`);
        }
        console.log(`Script output: ${stdout}`);
        resolve(stdout);
      });
    });
  }

  /**
   * @swagger
   * /api/update-ollama-models:
   *   post:
   *     summary: Update Ollama models
   *     description: Triggers the update script for Ollama models
   *     responses:
   *       200:
   *         description: Update successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 output:
   *                   type: string
   *       500:
   *         description: Server error
   */
  app.post("/api/update-ollama-models", async (req, res) => {
    try {
      const output = await executeUpdateScript();
      res.json({
        message: "Ollama models update successful",
        output: output,
      });
    } catch (error) {
      console.error("Error updating Ollama models:", error);
      res.status(500).json({
        error: "Failed to update Ollama models",
        details: error.message,
      });
    }
  });

  const PORT = process.env.PORT || 3001;
  const HOST = "0.0.0.0"; // This allows connections from any IP

  app.listen(PORT, HOST, () => {
    console.log(chalk.green(`Server running on http://${HOST}:${PORT}`));
    console.log(chalk.yellow(`Local access: http://localhost:${PORT}`));
    console.log(
      chalk.blue(`Swagger UI available at http://localhost:${PORT}/api-docs`),
    );

    // Get the local IP addresses
    const networkInterfaces = os.networkInterfaces();
    Object.keys(networkInterfaces).forEach((interfaceName) => {
      const interfaces = networkInterfaces[interfaceName];
      interfaces.forEach((iface) => {
        if ("IPv4" !== iface.family || iface.internal !== false) {
          // Skip over internal (i.e. 127.0.0.1) and non-IPv4 addresses
          return;
        }
        console.log(
          chalk.cyan(
            `Network access (${interfaceName}): http://${iface.address}:${PORT}`,
          ),
        );
        console.log(
          chalk.magenta(
            `Swagger UI network access (${interfaceName}): http://${iface.address}:${PORT}/api-docs`,
          ),
        );
      });
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(chalk.red("Error:"), err);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later.",
    });
  });

  process.on("exit", () => {
    console.log(chalk.yellow("Generating session summary..."));
    artifactManager.generateSessionSummary();
    console.log(chalk.green("Session summary generated. Goodbye!"));
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    console.error(
      chalk.red("Unhandled Rejection at:"),
      promise,
      chalk.red("reason:"),
      reason,
    );
    // Application specific logging, throwing an error, or other logic here
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (error) => {
    console.error(chalk.red("Uncaught Exception:"), error);
    // Application specific logging, throwing an error, or other logic here
    process.exit(1); // Exit with failure
  });
})();
