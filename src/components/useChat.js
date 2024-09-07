import { useState, useEffect, useMemo, useCallback } from "react";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [placeholderText, setPlaceholderText] = useState("");
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [systemMessage, setSystemMessage] =
    useState(`You are an AI assistant specialized in creating rich, interactive content for web applications. When responding with special content types, use <antArtifact> tags to encapsulate them. The available artifact types are:

1. Code: For programming language snippets. Specify the language for proper syntax highlighting.
2. Image: For SVG content or image URLs.
3. Chart: For creating data visualizations using Chart.js syntax.
4. Table: For structured data in table format.
5. Interactive: For content with JavaScript interactivity.
6. HTML: For general HTML content, including Bootstrap-styled pages.
7. Mermaid: For creating diagrams and flowcharts using Mermaid syntax.
8. React: For React component code.

Format your artifacts like this:

<antArtifact identifier="unique-id" type="artifact-type" language="specific-language" title="Descriptive Title">
{
  // For Chart artifacts, use this structure:
  "type": "bar", // or "line", "pie", etc.
  "data": {
    "labels": ["Label1", "Label2", "Label3"],
    "datasets": [{
      "label": "Dataset Label",
      "data": [value1, value2, value3],
      "backgroundColor": "rgba(75, 192, 192, 0.6)"
    }]
  },
  "options": {
    "responsive": true,
    "plugins": {
      "title": {
        "display": true,
        "text": "Chart Title"
      }
    }
  }
}
</antArtifact>

Guidelines for specific artifact types:

1. Code: Always specify the language. Example:
<antArtifact identifier="code-example" type="code" language="javascript" title="Hello World">
console.log('Hello, World!');
</antArtifact>
2. Chart: Use the Chart.js structure as shown above.

3. Table: Provide data in a JSON array of objects format. Example:

3. Table: Provide data as a JSON object with 'headers' and 'data' properties. Example:
<antArtifact identifier="table-example" type="table" title="Employee Data">
{
  "headers": ["Name", "Age", "Role"],
  "data": [
    {"Name": "Alice", "Age": 30, "Role": "Developer"},
    {"Name": "Bob", "Age": 28, "Role": "Designer"}
  ]
}</antArtifact>
4. HTML: You can include full HTML pages with Bootstrap. External resources are allowed from https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/.

5. Mermaid: Provide Mermaid diagram syntax directly.

6. React: Provide the full component code, including imports.

Always strive to provide the most relevant and interactive content possible. You may combine multiple artifacts in your responses to create comprehensive and engaging content. Ensure all content is directly usable by the application without additional processing.

Remember:

- Each artifact should be self-contained and complete.
- Do not include any code or tags outside of the artifact content itself.
- When asked for visualizations or data representation, default to using appropriate artifacts rather than describing them in text.
- Always use proper syntax and formatting within artifacts to ensure they render correctly.
- For tables, always include both 'headers' and 'data' in the JSON structure.
`);

  const [stats, setStats] = useState({ tokensPerSecond: 0, totalTokens: 0 });
  const [streamingMessage, setStreamingMessage] = useState(null);

  const placeholders = useMemo(
    () => [
      "Generate a chart to visualize the latest AI model performance trends.",
      "Create a table to compare AI frameworks based on speed and accuracy.",
      "Render a diagram of the neural network architecture for deeper analysis.",
      "Generate a bar chart to display the most popular programming languages of 2024.",
      "Create an interactive HTML page to showcase AI milestones.",
      "Show me a pie chart breaking down cloud usage among top companies.",
      "Generate a flowchart illustrating the machine learning pipeline.",
      "Build a React component that fetches and displays real-time stock data.",
      "Create a responsive dashboard to visualize key business metrics.",
      "Generate a table that compares the top LLMs for specific use cases.",
    ],
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderText(
        placeholders[Math.floor(Math.random() * placeholders.length)],
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [placeholders]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!inputValue.trim()) return;
      if (!selectedModel) {
        setError("Please select a model before sending a message.");
        return;
      }

      const userMessage = {
        role: "user",
        content: inputValue.trim(),
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputValue("");
      setIsLoading(true);
      setError(null);

      const startTime = Date.now();
      let totalTokens = 0;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              { role: "system", content: systemMessage },
              ...messages,
              userMessage,
            ],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `API responded with ${response.status}`,
          );
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiMessage = {
          role: "assistant",
          content: "",
          timestamp: new Date(),
        };
        setStreamingMessage(aiMessage);

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(5).trim();

              if (data === "[DONE]") {
                // End of stream, finalize the message
                setStreamingMessage(null);
                setMessages((prevMessages) => [...prevMessages, aiMessage]);
                break;
              }

              try {
                const parsedData = JSON.parse(data);
                if (parsedData.content) {
                  // Update the aiMessage content token by token
                  aiMessage.content += parsedData.content;
                  aiMessage.provider = parsedData.provider;

                  setStreamingMessage({ ...aiMessage });

                  totalTokens += 1; // Increment token count

                  // Update stats in real-time
                  const currentTime = Date.now();
                  const elapsedTime = (currentTime - startTime) / 1000;
                  setStats({
                    tokensPerSecond: Math.round(totalTokens / elapsedTime),
                    totalTokens: totalTokens,
                  });

                  // Introduce a small delay to simulate token-by-token streaming
                  await new Promise((resolve) => setTimeout(resolve, 10));
                }
                if (parsedData.fullContent) {
                  // This is the final message with full content
                  aiMessage.content = parsedData.fullContent;
                  setStreamingMessage(null);
                  setMessages((prevMessages) => [...prevMessages, aiMessage]);
                  break;
                }
              } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
              }
            }
          }
        }

        // Add the final message to the messages array
        // setMessages((prevMessages) => [...prevMessages, aiMessage]);

        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        setStats({
          tokensPerSecond: Math.round(totalTokens / duration),
          totalTokens: totalTokens,
        });

        return aiMessage;
      } catch (error) {
        console.error("Detailed error:", error);
        setError(`Failed to get a response from the AI. ${error.message}`);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "error", content: error.message, timestamp: new Date() },
        ]);
      } finally {
        setIsLoading(false);
        setStreamingMessage(null);
      }
    },
    [inputValue, messages, selectedModel, systemMessage],
  );

  return {
    messages,
    streamingMessage,
    inputValue,
    setInputValue,
    placeholderText,
    error,
    selectedModel,
    setSelectedModel,
    isLoading,
    systemMessage,
    setSystemMessage,
    stats,
    handleSubmit,
  };
};
