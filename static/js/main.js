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
  const iframe = document.createElement("iframe");
  iframe.sandbox = "allow-scripts allow-same-origin";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.srcdoc = htmlContent;
  container.innerHTML = "";
  container.appendChild(iframe);
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
    currentArtifact: null,
    showHtmlPreview: false,
    systemMessage: "",

    async init() {
      this.availableModels = await fetchAvailableModels();
      if (this.availableModels.length > 0) {
        this.selectedModel = this.availableModels[0];
      }
      await this.loadChatHistory();
      await this.loadArtifacts();
    },

    async loadChatHistory() {
      try {
        const response = await fetch("/chat_history");
        if (response.ok) {
          this.chatHistory = await response.json();
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
        timestamp: new Date().toISOString(),
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
            chat_history: this.chatHistory.slice(-10),
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
          timestamp: new Date().toISOString(),
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

        this.chatHistory = [...this.chatHistory];
      } catch (error) {
        console.error("Error:", error);
        this.chatHistory.push({
          role: "assistant",
          content: "An error occurred while generating the response.",
          id: Date.now() + 2,
          timestamp: new Date().toISOString(),
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
        (msg) => msg.role === "assistant"
      );
      if (lastAssistantMessage) {
        lastAssistantMessage.content = content;
        lastAssistantMessage.id = id;
      }
    },

    handleNewArtifact(artifactData, artifactId) {
      const newArtifact = { ...artifactData, id: artifactId, timestamp: new Date().toISOString() };
      this.artifacts.unshift(newArtifact);
      this.showArtifact = true;
      this.currentArtifact = newArtifact;
      this.displayCurrentArtifact();
      
      this.chatHistory.push({
        role: "artifact",
        content: `Artifact created: ${artifactData.filename || 'HTML content'}`,
        artifactId: artifactId,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      });
      
      this.scrollChatToBottom();
    },

    openArtifact(artifactId) {
      const artifact = this.artifacts.find(a => a.id === artifactId);
      if (artifact) {
        this.currentArtifact = artifact;
        this.showArtifact = true;
        this.displayCurrentArtifact();
      } else {
        console.error(`Artifact with ID ${artifactId} not found`);
      }
    },

    toggleArtifact() {
      this.showArtifact = !this.showArtifact;
      if (this.showArtifact && this.currentArtifact) {
        this.$nextTick(() => {
          this.displayCurrentArtifact();
        });
      }
    },

    displayCurrentArtifact() {
      if (!this.currentArtifact) return;
      const artifact = this.currentArtifact;

      const codeView = document.getElementById("code-view");
      const htmlPreview = document.getElementById("html-preview");

      // Always prepare both views
      codeView.innerHTML = `<pre><code class="language-auto">${this.escapeHtml(artifact.content)}</code></pre>`;
      hljs.highlightElement(codeView.querySelector('code'));

      if (artifact.filename.endsWith(".html") || artifact.content.trim().startsWith("<!DOCTYPE html>")) {
        renderHTML(artifact.content, htmlPreview);
        this.showHtmlPreview = true;
      } else {
        this.showHtmlPreview = false;
      }
    },

    toggleHtmlPreview() {
      if (this.currentArtifact?.filename.endsWith(".html") || this.currentArtifact?.content.trim().startsWith("<!DOCTYPE html>")) {
        this.showHtmlPreview = !this.showHtmlPreview;
      } else {
        alert("HTML preview is only available for HTML content.");
      }
    },

    copyArtifact() {
      if (!this.currentArtifact) return;
      navigator.clipboard.writeText(this.currentArtifact.content).then(
        () => {
          alert("Artifact content copied to clipboard!");
        },
        (err) => {
          console.error("Could not copy text: ", err);
        }
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

    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    }
  };
}

document.addEventListener("alpine:init", () => {
  Alpine.data("chatApp", chatApp);
});