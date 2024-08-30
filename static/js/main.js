async function fetchAvailableModels() {
  try {
    const response = await fetch("/available_models");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
}

function renderHTML(htmlContent, container) {
  // Create a sandboxed iframe
  const iframe = document.createElement("iframe");
  iframe.sandbox = "allow-scripts allow-same-origin";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  // Set the content of the iframe
  iframe.srcdoc = htmlContent;

  // Replace the content of the preview area with the iframe
  container.innerHTML = "";
  container.appendChild(iframe);

  // Adjust iframe height after content loads
  iframe.onload = () => {
    iframe.style.height = "100%";
  };
}

function chatApp() {
  return {
    chatHistory: [],
    userInput: "",
    selectedModel: "",
    availableModels: [],
    isLoading: false,
    showArtifact: false,
    artifacts: [],
    currentArtifactIndex: -1,
    showHtmlPreview: false,
    systemMessage: "",
    showSystemMessage: false,
    isArtifactExpanded: false,

    async init() {
      this.availableModels = await fetchAvailableModels();
      if (this.availableModels.length > 0) {
        this.selectedModel = this.availableModels[0];
      }
      this.initResizable();
      await this.loadChatHistory();
      await this.loadArtifacts();
    },

    async loadChatHistory() {
      try {
        const response = await fetch("/chat_history");
        if (response.ok) {
          const history = await response.json();
          this.chatHistory = history;
          this.$nextTick(() => {
            this.scrollChatToBottom();
          });
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    },

    async loadArtifacts() {
      try {
        const response = await fetch("/artifacts");
        if (response.ok) {
          this.artifacts = await response.json();
        }
      } catch (error) {
        console.error("Error loading artifacts:", error);
      }
    },

    async sendMessage() {
      if (this.userInput.trim() === "") return;

      const userMessage = this.userInput;
      this.chatHistory.push({
        role: "user",
        content: userMessage,
        id: Date.now(),
      });
      this.userInput = "";
      this.isLoading = true;
      this.showArtifact = false;

      try {
        const response = await fetch("/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: this.selectedModel,
            prompt: userMessage,
            system_message: this.systemMessage,
            chat_history: this.chatHistory.slice(-10), // Send last 10 messages for context
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate response");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiResponse = "";
        let responseId = Date.now() + 1;

        this.chatHistory.push({
          role: "assistant",
          content: "",
          id: responseId,
        });

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.trim() === "") continue;
            try {
              const data = JSON.parse(line);
              if (data.error) {
                throw new Error(data.error);
              }
              if (data.token) {
                aiResponse += data.token;
                this.updateLastAssistantMessage(aiResponse, responseId);
                this.scrollChatToBottom();
              } else if (data.type === "artifact") {
                this.handleNewArtifact(data.data, data.id);
              }
            } catch (parseError) {
              console.error("Error parsing JSON:", parseError);
            }
          }
        }

        // Force a re-render of the chat history
        this.chatHistory = [...this.chatHistory];
      } catch (error) {
        console.error("Error:", error);
        this.chatHistory.push({
          role: "assistant",
          content: "An error occurred while generating the response.",
          id: Date.now() + 2,
        });
      } finally {
        this.isLoading = false;
      }

      this.$nextTick(() => {
        this.scrollChatToBottom();
      });
    },

    updateLastAssistantMessage(content, id) {
      const lastAssistantMessage = this.chatHistory.findLast(
        (msg) => msg.role === "assistant",
      );
      if (lastAssistantMessage) {
        lastAssistantMessage.content = content;
        lastAssistantMessage.id = id;
      }
    },

    handleNewArtifact(artifactData, artifactId) {
      const newArtifact = { ...artifactData, id: artifactId };
      this.artifacts.unshift(newArtifact);
      this.showArtifact = true;
      this.currentArtifactIndex = 0;
      this.displayCurrentArtifact();
      
      // Add artifact reference to chat history
      this.chatHistory.push({
        role: "artifact",
        content: `Artifact created: ${artifactData.filename || 'HTML content'}`,
        artifactId: artifactId,
        id: Date.now(),
      });
      
      this.scrollChatToBottom();
    },

    openArtifact(artifactId) {
      const index = this.artifacts.findIndex(artifact => artifact.id === artifactId);
      if (index !== -1) {
        this.currentArtifactIndex = index;
        this.showArtifact = true;
        this.displayCurrentArtifact();
      } else {
        console.error(`Artifact with ID ${artifactId} not found`);
      }
    },

    displayCurrentArtifact() {
      if (this.currentArtifactIndex < 0) return;
      const artifact = this.artifacts[this.currentArtifactIndex];

      const artifactContainer = document.getElementById("artifact-display");
      const htmlPreview = document.getElementById("html-preview");

      if (artifact.filename.endsWith(".html") || artifact.content.trim().startsWith("<!DOCTYPE html>")) {
        renderHTML(artifact.content, htmlPreview);
        this.showHtmlPreview = true;
      } else if (artifact.content.startsWith("http")) {
        // Handle remote content
        const iframe = document.createElement("iframe");
        iframe.src = artifact.content;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        artifactContainer.innerHTML = "";
        artifactContainer.appendChild(iframe);
        this.showHtmlPreview = false;
      } else {
        artifactContainer.innerHTML = `<pre><code>${this.escapeHtml(artifact.content)}</code></pre>`;
        this.showHtmlPreview = false;
      }
    },

    toggleHtmlPreview() {
      this.showHtmlPreview = !this.showHtmlPreview;
      this.displayCurrentArtifact();
    },

    copyArtifact() {
      if (this.currentArtifactIndex < 0) return;
      const artifact = this.artifacts[this.currentArtifactIndex];
      navigator.clipboard.writeText(artifact.content).then(
        () => {
          alert("Code copied to clipboard!");
        },
        (err) => {
          console.error("Could not copy text: ", err);
        },
      );
    },

    escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },

    scrollChatToBottom() {
      const chatHistory = document.getElementById("chat-history");
      chatHistory.scrollTop = chatHistory.scrollHeight;
    },

    toggleArtifactExpansion() {
      this.isArtifactExpanded = !this.isArtifactExpanded;
      const panel = document.getElementById("artifact-panel");
      panel.classList.toggle("expanded", this.isArtifactExpanded);
      if (this.isArtifactExpanded) {
        panel.style.position = "fixed";
        panel.style.top = "0";
        panel.style.left = "0";
        panel.style.right = "0";
        panel.style.bottom = "0";
        panel.style.width = "100%";
        panel.style.height = "100%";
        panel.style.zIndex = "1000";
      } else {
        panel.style.position = "";
        panel.style.top = "";
        panel.style.left = "";
        panel.style.right = "";
        panel.style.bottom = "";
        panel.style.width = "";
        panel.style.height = "";
        panel.style.zIndex = "";
      }
      this.displayCurrentArtifact(); // Refresh the display
    },

    initResizable() {
      const panel = document.getElementById("artifact-panel");
      const handle = document.createElement("div");
      handle.className = "resizable-handle";
      panel.appendChild(handle);

      let isResizing = false;
      let startX, startWidth;

      handle.addEventListener("mousedown", (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = parseInt(window.getComputedStyle(panel).width, 10);
      });

      document.addEventListener("mousemove", (e) => {
        if (!isResizing) return;
        const width = startWidth - (e.clientX - startX);
        panel.style.width = `${Math.max(300, Math.min(width, window.innerWidth * 0.8))}px`;
      });

      document.addEventListener("mouseup", () => {
        isResizing = false;
      });
    },
  };
}

// Initialize Alpine.js
document.addEventListener("alpine:init", () => {
  Alpine.data("chatApp", chatApp);
});
