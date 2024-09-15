const express = require("express");
const app = express();
const Anthropic = require("@anthropic-ai/sdk");
const axios = require("axios");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");
const ArtifactManager = require("./src/utils/ArtifactManager");
const fs = require("fs").promises;
const { execFile } = require("child_process");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const chalk = require("chalk");
const os = require("os");
const cors = require("cors");

const USER_PREFERENCES_FILE = path.join(__dirname, "user_preferences.json");

dotenv.config();

let anthropic;
let openai;
let ollamaApiUrl;

// Initialize user preferences
async function initializeUserPreferences() {
  const defaultPreferences = {
    savedMessages: [],
    lastUsedModel: "",
    lastUsedSystemMessage: "You are a helpful AI assistant.",
    apiKeys: {
      OLLAMA_API_URL: "",
      ANTHROPIC_API_KEY: "",
      OPENAI_API_KEY: "",
    },
  };

  try {
    await fs.access(USER_PREFERENCES_FILE);
    console.log("User preferences file already exists.");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("Creating default user preferences file...");
      await fs.writeFile(
        USER_PREFERENCES_FILE,
        JSON.stringify(defaultPreferences, null, 2)
      );
      console.log("Default user preferences file created successfully.");
    } else {
      console.error("Error checking user preferences file:", error);
    }
  }
}

// Initialize API clients
async function initializeApiClients() {
  try {
    const data = await fs.readFile(USER_PREFERENCES_FILE, "utf8");
    const preferences = JSON.parse(data);
    const apiKeys = preferences.apiKeys || {};

    if (apiKeys.ANTHROPIC_API_KEY && apiKeys.ANTHROPIC_API_KEY !== "********") {
      anthropic = new Anthropic.Anthropic({
        apiKey: apiKeys.ANTHROPIC_API_KEY,
      });
    } else {
      console.log(
        "Valid Anthropic API key not found. Anthropic features will be disabled."
      );
      anthropic = null;
    }

    if (apiKeys.OPENAI_API_KEY && apiKeys.OPENAI_API_KEY !== "********") {
      openai = new OpenAI({
        apiKey: apiKeys.OPENAI_API_KEY,
      });
    } else {
      console.log(
        "Valid OpenAI API key not found. OpenAI features will be disabled."
      );
      openai = null;
    }

    ollamaApiUrl = apiKeys.OLLAMA_API_URL || process.env.OLLAMA_API_URL;
  } catch (error) {
    console.error("Error initializing API clients:", error);
  }
}

// Start the server
async function startServer() {
  // Initialize user preferences and API clients
  await initializeUserPreferences();
  await initializeApiClients();

  console.log(
    chalk.blue(`
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
    `)
  );

  console.log(chalk.cyan("ArtyLLaMa Server Starting..."));

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

  app.set("trust proxy", 1);

  const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true,
    keyGenerator: (req) => req.ip,
  });

  app.use(apiLimiter);
  app.use(cors());

  app.use(
    compression({
      filter: (req, res) => {
        if (
          req.headers.accept &&
          req.headers.accept.includes("text/event-stream")
        ) {
          return false;
        }
        return compression.filter(req, res);
      },
    })
  );

  app.use(express.json());

  const artifactManager = new ArtifactManager();

  // Swagger definition
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "ArtyLLaMa API",
        version: "0.1.0",
        description:
          "API for ArtyLLaMa, an AI-powered chat interface for interacting with open-source language models",
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
   *     description: Fetches a list of available AI models from various providers (Ollama, Anthropic, OpenAI)
   *     tags: [Models]
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
   *                     $ref: '#/components/schemas/Model'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
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
        allModels = [
          ...allModels,
          ...anthropicModels.map((name) => ({ name })),
        ];
      } else {
        console.log("ANTHROPIC_API_KEY is not set. Skipping Anthropic models.");
      }

      if (openai) {
        try {
          const openaiModelsResponse = await openai.models.list();
          const chatModels = openaiModelsResponse.data.filter(
            (model) =>
              model.id.includes("gpt") || model.id.includes("text-davinci")
          );
          allModels = [
            ...allModels,
            ...chatModels.map((model) => ({ name: model.id })),
          ];
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
   *     description: Send a message to the selected AI model and receive a streaming response
   *     tags: [Chat]
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
   *                 description: The name of the AI model to use (e.g., 'claude-3-opus-20240229', 'gpt-4', etc.)
   *               messages:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     role:
   *                       type: string
   *                       enum: [system, user, assistant]
   *                     content:
   *                       type: string
   *               max_tokens:
   *                 type: integer
   *                 description: The maximum number of tokens to generate
   *               temperature:
   *                 type: number
   *                 description: Controls randomness in the response (0.0 to 1.0)
   *               stream:
   *                 type: boolean
   *                 description: Whether to stream the response (always true for this endpoint)
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           text/event-stream:
   *             schema:
   *               type: object
   *               properties:
   *                 content:
   *                   type: string
   *                   description: The generated text chunk
   *                 provider:
   *                   type: string
   *                   enum: [anthropic, openai, ollama]
   *                   description: The AI provider used for this response
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                 message:
   *                   type: string
   *                 details:
   *                   type: string
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

        try {
          const systemMessage = combinedMessages.find(
            (msg) => msg.role === "system"
          );
          const userMessages = combinedMessages.filter(
            (msg) => msg.role !== "system"
          );

          const messageParams = {
            model: model,
            max_tokens: 4096,
            messages: userMessages,
            stream: true,
          };

          if (systemMessage) {
            messageParams.system = systemMessage.content;
          }

          const stream = await anthropic.messages.create(messageParams);

          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          });

          let fullContent = "";

          for await (const event of stream) {
            switch (event.type) {
              case "message_start":
                // You can log or handle the start of the message if needed
                break;
              case "content_block_start":
                // Handle the start of a new content block if needed
                break;
              case "content_block_delta":
                if (event.delta.type === "text_delta") {
                  const chunkContent = event.delta.text;
                  fullContent += chunkContent;
                  res.write(
                    `data: ${JSON.stringify({
                      content: chunkContent,
                      provider: "anthropic",
                    })}\n\n`
                  );
                  res.flush();
                }
                // Handle other delta types (e.g., 'input_json_delta') if needed
                break;
              case "content_block_stop":
                // Handle the end of a content block if needed
                break;
              case "message_delta":
                // Handle message-level updates if needed
                break;
              case "message_stop":
                res.write(
                  `data: ${JSON.stringify({
                    content: "[DONE]",
                    provider: "anthropic",
                    fullContent: fullContent,
                  })}\n\n`
                );
                res.end();
                break;
            }
          }

          artifactManager.addArtifact({
            type: "chat",
            model: model,
            content: fullContent,
          });
        } catch (error) {
          console.error("Anthropic API error:", error);
          if (!res.headersSent) {
            res.status(500).json({
              error: "Anthropic API error",
              message:
                "An error occurred while processing your request. Please try again later.",
              details: error.message,
            });
          } else {
            res.end();
          }
        }
      } else if (model.startsWith("gpt-")) {
        // OpenAI API call
        if (!openai) {
          return res.status(500).json({
            error: "OpenAI API error",
            message: "OpenAI API key is not configured.",
          });
        }

        try {
          const completion = await openai.chat.completions.create({
            model: model,
            messages: combinedMessages,
            max_tokens: 4096,
            stream: true,
          });

          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          });

          let fullContent = "";

          try {
            for await (const part of completion) {
              if (part.choices[0]?.delta?.content) {
                const chunkContent = part.choices[0].delta.content;
                fullContent += chunkContent;

                res.write(
                  `data: ${JSON.stringify({
                    content: chunkContent,
                    provider: "openai",
                  })}\n\n`
                );
                res.flush(); // Ensure immediate sending
              }
            }
          } catch (streamError) {
            console.error("Error during OpenAI streaming:", streamError);
            if (!res.writableEnded) {
              res.write(
                `data: ${JSON.stringify({
                  error: "Error during streaming",
                  message: streamError.message,
                })}\n\n`
              );
              res.end();
            }
            return; // Prevent further execution
          }

          res.write(
            `data: ${JSON.stringify({
              content: "[DONE]",
              provider: "openai",
              fullContent: fullContent,
            })}\n\n`
          );
          res.end();

          artifactManager.addArtifact({
            type: "chat",
            model: model,
            content: fullContent,
          });
        } catch (error) {
          console.error("OpenAI API error:", error);
          if (!res.headersSent) {
            res.status(500).json({
              error: "OpenAI API error",
              message:
                "An error occurred while processing your request. Please try again later.",
              details: error.message,
            });
          } else if (!res.writableEnded) {
            res.end();
          }
          return; // Prevent further execution
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
            }
          );

          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          });

          let fullContent = "";

          response.data.on("data", (chunk) => {
            try {
              const lines = chunk
                .toString("utf8")
                .split("\n")
                .filter((line) => line.trim() !== "");
              for (const line of lines) {
                try {
                  const parsedLine = JSON.parse(line);
                  if (parsedLine.message && parsedLine.message.content) {
                    const chunkContent = parsedLine.message.content;
                    fullContent += chunkContent;
                    res.write(
                      `data: ${JSON.stringify({
                        content: chunkContent,
                        provider: "ollama",
                      })}\n\n`
                    );
                    res.flush(); // Ensure immediate sending
                  }
                  if (parsedLine.done) {
                    res.write(
                      `data: ${JSON.stringify({
                        content: "[DONE]",
                        provider: "ollama",
                        fullContent: fullContent,
                      })}\n\n`
                    );
                    res.end();

                    artifactManager.addArtifact({
                      type: "chat",
                      model: model,
                      content: fullContent,
                    });
                    return; // Prevent further execution
                  }
                } catch (parseError) {
                  console.error("Error parsing Ollama chunk:", parseError);
                  if (!res.writableEnded) {
                    res.write(
                      `data: ${JSON.stringify({
                        error: "Error parsing chunk",
                        message: parseError.message,
                      })}\n\n`
                    );
                    res.end();
                  }
                  return; // Prevent further execution
                }
              }
            } catch (dataError) {
              console.error("Error processing Ollama data:", dataError);
              if (!res.writableEnded) {
                res.write(
                  `data: ${JSON.stringify({
                    error: "Error processing data",
                    message: dataError.message,
                  })}\n\n`
                );
                res.end();
              }
              return; // Prevent further execution
            }
          });

          response.data.on("end", () => {
            if (!res.writableEnded) {
              res.write(
                `data: ${JSON.stringify({
                  content: "[DONE]",
                  provider: "ollama",
                  fullContent: fullContent,
                })}\n\n`
              );
              res.end();

              artifactManager.addArtifact({
                type: "chat",
                model: model,
                content: fullContent,
              });
            }
          });

          response.data.on("error", (error) => {
            console.error("Ollama stream error:", error);
            if (!res.writableEnded) {
              res.write(
                `data: ${JSON.stringify({
                  error: "Ollama stream error",
                  message: error.message,
                })}\n\n`
              );
              res.end();
            }
            return; // Prevent further execution
          });
        } catch (error) {
          console.error("Ollama API error:", error);
          if (!res.headersSent) {
            res.status(500).json({
              error: "Ollama API error",
              message:
                "An error occurred while processing your request. Please try again later.",
              details: error.message,
            });
          } else if (!res.writableEnded) {
            res.end();
          }
          return; // Prevent further execution
        }
      }
    } catch (error) {
      console.error("API error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Failed to call API",
          details: error.message,
        });
      } else if (!res.writableEnded) {
        res.end();
      }
      return; // Prevent further execution
    }
  });

  /**
   * @swagger
   * /api/user-preferences:
   *   get:
   *     summary: Get user preferences
   *     description: Retrieves the user preferences from the server
   *     tags: [User Preferences]
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserPreferences'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *   post:
   *     summary: Save user preferences
   *     description: Saves the user preferences to the server
   *     tags: [User Preferences]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserPreferences'
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
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  app.get("/api/user-preferences", async (req, res) => {
    try {
      const data = await fs.readFile(USER_PREFERENCES_FILE, "utf8");
      const preferences = JSON.parse(data);
      res.json(preferences);
    } catch (error) {
      console.error("Error reading user preferences:", error);
      res.status(500).json({ error: "Failed to read user preferences" });
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
      const preferences = req.body;
      await fs.writeFile(
        USER_PREFERENCES_FILE,
        JSON.stringify(preferences, null, 2)
      );
      res.json({ message: "User preferences updated successfully" });
    } catch (error) {
      console.error("Error writing user preferences:", error);
      res.status(500).json({ error: "Failed to update user preferences" });
    }
  });

  // Function to execute the update script
  function executeUpdateScript() {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, "update_ollama_models.sh");
      execFile("bash", [scriptPath], (error, stdout, stderr) => {
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

  app.get("/api/test-stream", (req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });

    let count = 0;
    const intervalId = setInterval(() => {
      count += 1;
      res.write(`data: ${JSON.stringify({ message: `Event ${count}` })}\n\n`);
      res.flush();

      if (count === 10) {
        clearInterval(intervalId);
        res.write("data: [DONE]\n\n");
        res.end();
      }
    }, 1000);
  });

  /**
   * @swagger
   * /api/update-ollama-models:
   *   post:
   *     summary: Update Ollama models
   *     description: Triggers the update script for Ollama models
   *     tags: [Models]
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
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                 details:
   *                   type: string
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

  // Start the server
  const PORT = process.env.PORT || 3001;
  const HOST = "0.0.0.0"; // Change this to allow connections from any IP

  const server = app.listen(PORT, HOST, () => {
    console.log(chalk.green(`Server running on http://${HOST}:${PORT}`));
    console.log(chalk.yellow(`Local access: http://localhost:${PORT}`));
    console.log(
      chalk.blue(`Swagger UI available at http://localhost:${PORT}/api-docs`)
    );

    // Get the local IP addresses
    const networkInterfaces = os.networkInterfaces();
    Object.keys(networkInterfaces).forEach((interfaceName) => {
      const interfaces = networkInterfaces[interfaceName];
      interfaces.forEach((iface) => {
        if (iface.family === "IPv4" && !iface.internal) {
          console.log(
            chalk.cyan(
              `Network access (${interfaceName}): http://${iface.address}:${PORT}`
            )
          );
          console.log(
            chalk.magenta(
              `Swagger UI network access (${interfaceName}): http://${iface.address}:${PORT}/api-docs`
            )
          );
        }
      });
    });
  });

  // Increase server timeout to handle long-running requests
  server.timeout = 120000; // Set to 2 minutes (120,000 ms)

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(chalk.red("Error:"), err);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred. Please try again later.",
      });
    } else if (!res.writableEnded) {
      res.end();
    }
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
      reason
    );
    // Application specific logging, throwing an error, or other logic here
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (error) => {
    console.error(chalk.red("Uncaught Exception:"), error);
    // Application specific logging, throwing an error, or other logic here
    process.exit(1); // Exit with failure
  });
}

// Invoke the startServer function
startServer().catch((error) => {
  console.error("Failed to start the server:", error);
});
