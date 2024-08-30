async function fetchAvailableModels() {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.models.map(model => model.name);
    } catch (error) {
      console.error('Error fetching models:', displayCurrentArtifact);
      return [];
    }
  }
  
  function renderHTML(htmlContent) {
    // Process placeholders
    htmlContent = htmlContent.replace(/src="([^"]+)"/g, (match, url) => {
      if (url.startsWith('http')) {
        return `src="/api/placeholder/400/300" alt="Placeholder for ${url}"`;
      }
      return match;
    });
  
    // Create a sandboxed iframe
    const iframe = document.createElement('iframe');
    iframe.sandbox = 'allow-scripts';
    iframe.style.width = '100%';
    iframe.style.height = '500px';
    iframe.style.border = 'none';
  
    // Set the content of the iframe
    iframe.srcdoc = htmlContent;
  
    // Replace the content of the preview area with the iframe
    const previewArea = document.getElementById('html-preview');
    previewArea.innerHTML = '';
    previewArea.appendChild(iframe);
  
    // Adjust iframe height after content loads
    iframe.onload = () => {
      iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
    };
  }
  
  function chatApp() {
    return {
      chatHistory: [],
      userInput: '',
      selectedModel: '',
      availableModels: [],
      isLoading: false,
      showArtifact: false,
      artifacts: [],
      currentArtifactIndex: -1,
      showHtmlPreview: false,
      systemMessage: '',
      showSystemMessage: false,
      isArtifactExpanded: false,
  
      async init() {
        this.availableModels = await fetchAvailableModels();
        if (this.availableModels.length > 0) {
          this.selectedModel = this.availableModels[0];
        }
        this.initResizable();
      },
  
      async sendMessage() {
        if (this.userInput.trim() === '') return;
        
        const userMessage = this.userInput;
        this.chatHistory.push({ role: 'user', content: userMessage, id: Date.now() });
        this.userInput = '';
        this.isLoading = true;
        this.showArtifact = false;
        
        try {
          const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: this.selectedModel,
              messages: this.chatHistory.map(msg => ({
                role: msg.role,
                content: msg.content
              })),
              stream: true
            })
          });
        
          if (!response.ok) {
            throw new Error('Failed to generate response');
          }
        
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let aiResponse = '';
        
          this.chatHistory.push({ role: 'assistant', content: '', id: Date.now() + 1 });
        
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
        
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
        
            for (const line of lines) {
              if (line.trim() === '') continue;
              try {
                const data = JSON.parse(line);
                if (data.error) {
                  throw new Error(data.error);
                }
                if (data.message && data.message.content) {
                  aiResponse += data.message.content;
                  this.chatHistory[this.chatHistory.length - 1].content = aiResponse;
                }
              } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
              }
            }
        
            // Force a re-render of the chat history
            this.chatHistory = [...this.chatHistory];
          }
  
          // Check for artifacts in the response
          const artifacts = this.extractArtifacts(aiResponse);
          if (artifacts.length > 0) {
            artifacts.forEach(artifact => this.addArtifact(artifact));
            this.showArtifact = true;
          }
  
        } catch (error) {
          console.error('Error:', error);
          this.chatHistory.push({ role: 'assistant', content: 'An error occurred while generating the response.', id: Date.now() + 2 });
        } finally {
          this.isLoading = false;
        }
        
        this.$nextTick(() => {
          this.scrollChatToBottom();
        });
      },
  
      extractArtifacts(response) {
        const artifacts = [];
        const regex = /```(\w+)?\n([\s\S]+?)\n```/g;
        let match;
        while ((match = regex.exec(response)) !== null) {
          artifacts.push({
            language: match[1] || 'text',
            content: match[2]
          });
        }
        return artifacts;
      },
  
      closeArtifact() {
        this.showArtifact = false;
      },
  
      addArtifact(data) {
        const artifact = {
          filename: `artifact_${Date.now()}.${data.language}`,
          content: data.content,
          isHtml: this.detectHtmlContent(data.content)
        };
        this.artifacts.push(artifact);
        this.currentArtifactIndex = this.artifacts.length - 1;
        
        this.chatHistory.push({
          role: 'artifact',
          content: `Artifact: ${artifact.filename}`,
          id: Date.now(),
          artifactIndex: this.currentArtifactIndex
        });
      
        this.showArtifact = true;
        this.showHtmlPreview = artifact.isHtml;
        this.displayCurrentArtifact();
      },
  
      openArtifact(index) {
        this.currentArtifactIndex = index;
        this.showArtifact = true;
        this.displayCurrentArtifact();
      },
  
      displayCurrentArtifact() {
          if (this.currentArtifactIndex < 0) return;
          const artifact = this.artifacts[this.currentArtifactIndex];
          
          if (this.detectHtmlContent(artifact.content)) {
              renderHTML(artifact.content);
              this.showHtmlPreview = true;
          } else {
              const artifactContainer = document.getElementById('artifact-display');
              artifactContainer.innerHTML = `<pre><code>${this.escapeHtml(artifact.content)}</code></pre>`;
              this.showHtmlPreview = false;
          }
      },
  
      detectHtmlContent(content) {
        return /<\s*html|<\s*body|<.*>/.test(content.trim());
      },
  
      toggleHtmlPreview() {
        this.showHtmlPreview = !this.showHtmlPreview;
        this.displayCurrentArtifact();
      },
  
      copyArtifact() {
        if (this.currentArtifactIndex < 0) return;
        const artifact = this.artifacts[this.currentArtifactIndex];
        navigator.clipboard.writeText(artifact.content).then(() => {
          alert('Code copied to clipboard!');
        }, (err) => {
          console.error('Could not copy text: ', err);
        });
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
        const chatHistory = document.getElementById('chat-history');
        chatHistory.scrollTop = chatHistory.scrollHeight;
      },
  
      toggleArtifactExpansion() {
        this.isArtifactExpanded = !this.isArtifactExpanded;
        const panel = document.getElementById('artifact-panel');
        panel.classList.toggle('expanded', this.isArtifactExpanded);
      },
  
      initResizable() {
        const panel = document.getElementById('artifact-panel');
        const handle = document.createElement('div');
        handle.className = 'resizable-handle';
        panel.appendChild(handle);
  
        let isResizing = false;
        let startX, startWidth;
  
        handle.addEventListener('mousedown', (e) => {
          isResizing = true;
          startX = e.clientX;
          startWidth = parseInt(window.getComputedStyle(panel).width, 10);
        });
  
        document.addEventListener('mousemove', (e) => {
          if (!isResizing) return;
          const width = startWidth - (e.clientX - startX);
          panel.style.width = `${Math.max(300, Math.min(width, window.innerWidth * 0.8))}px`;
        });
  
        document.addEventListener('mouseup', () => {
          isResizing = false;
        });
      }
    };
  }
  
  // Initialize Alpine.js
  document.addEventListener('alpine:init', () => {
    Alpine.data('chatApp', chatApp);
  });
