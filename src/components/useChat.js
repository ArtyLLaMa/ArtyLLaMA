import { useState, useEffect, useMemo, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";

export const useChat = (userPreferences, currentSessionId, onTitleUpdate) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [placeholderText, setPlaceholderText] = useState("");
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [systemMessage, setSystemMessage] = useState("");
  const [stats, setStats] = useState({ tokensPerSecond: 0, totalTokens: 0 });
  const [streamingMessage, setStreamingMessage] = useState(null);
  const [firstAiResponseContent, setFirstAiResponseContent] = useState(null);

  // Effect to auto-generate title
  useEffect(() => {
    const autoGenerateTitle = async () => {
      if (
        firstAiResponseContent &&
        currentSessionId &&
        userPreferences?.autoGenerateChatTitle
      ) {
        try {
          const response = await axiosInstance.put(
            `/chat/sessions/${currentSessionId}/title`,
            { textForTitle: firstAiResponseContent }
          );
          if (response.data && response.data.session && onTitleUpdate) {
            onTitleUpdate(currentSessionId, response.data.session.title);
          }
          setFirstAiResponseContent(null);
        } catch (error) {
          console.error("Error auto-generating chat title:", error);
          setFirstAiResponseContent(null);
        }
      }
    };

    autoGenerateTitle();
  }, [firstAiResponseContent, currentSessionId, userPreferences, onTitleUpdate]);

  // Callback to clear any existing error messages.
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (userPreferences) {
      if (
        userPreferences.lastUsedModel &&
        userPreferences.lastUsedModel !== selectedModel
      ) {
        setSelectedModel(userPreferences.lastUsedModel);
      }
      if (
        userPreferences.lastUsedSystemMessage &&
        userPreferences.lastUsedSystemMessage !== systemMessage
      ) {
        setSystemMessage(userPreferences.lastUsedSystemMessage);
      }
    }
  }, [userPreferences, selectedModel, systemMessage]);

  const placeholders = useMemo(
    () => [
      "Generate a chart to visualize the latest AI model performance trends.",
      "Create a table to compare AI frameworks based on speed and accuracy.",
      "Render a diagram of the neural network architecture for deeper analysis.",
      "Generate a bar chart to display the most popular programming languages of 2024.",
    ],
    []
  );

  useEffect(() => {
    setPlaceholderText(
      placeholders[Math.floor(Math.random() * placeholders.length)]
    );
    const interval = setInterval(() => {
      setPlaceholderText(
        placeholders[Math.floor(Math.random() * placeholders.length)]
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [placeholders]);

  // Fetch messages when currentSessionId changes
  useEffect(() => {
    if (currentSessionId) {
      const fetchMessages = async () => {
        try {
          const response = await axiosInstance.get(
            `/chat/sessions/${currentSessionId}/messages`
          );
          setMessages(response.data.messages);
        } catch (error) {
          console.error("Error fetching messages:", error);
          setError("Failed to load messages for the selected session.");
        }
      };
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [currentSessionId]);

  const handleSubmit = useCallback(
    async (e, currentSessionId, createSessionAndSubmit) => {
      e.preventDefault();
      // Input validation: Prevent submitting empty messages.
      if (!inputValue.trim()) {
        setError("Message cannot be empty.");
        return;
      }
      if (!selectedModel) {
        setError("Please select a model before sending a message.");
        return;
      }
      // If there's no current session, and a function to create one is provided, call it.
      if (!currentSessionId && createSessionAndSubmit) {
        await createSessionAndSubmit(e);
        return;
      }
      // If still no currentSessionId (e.g., createSessionAndSubmit was not provided or failed),
      // set an error and return.
      if (!currentSessionId) {
        setError("Please select or create a chat session.");
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
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated. Please log in.");
        }

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              { role: "system", content: systemMessage },
              ...messages,
              userMessage,
            ],
            sessionId: currentSessionId,
          }),
        });

        if (!response.ok) {
          let errorText = await response.text();
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(
              errorData.message || `API responded with ${response.status}`
            );
          } catch (parseError) {
            throw new Error(
              `API responded with ${response.status}: ${errorText}`
            );
          }
        }

        const contentType = response.headers.get("Content-Type") || "";
        if (!contentType.includes("text/event-stream")) {
          const errorText = await response.text();
          throw new Error(
            `Expected text/event-stream but received ${contentType}: ${errorText}`
          );
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let aiMessage = {
          role: "assistant",
          content: "",
          timestamp: new Date(),
        };
        setStreamingMessage(aiMessage);

        let buffer = "";
        let streamProcessingComplete = false;

        while (true) {
          const { value, done } = await reader.read();

          if (done) {
            streamProcessingComplete = true;
          }

          buffer += decoder.decode(value, { stream: true });

          let lines = buffer.split("\n");

          buffer = done ? "" : lines.pop();

          for (const line of lines) {
            if (line.trim() === "") continue;

            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();

              if (data === "[DONE]") {
                const finalContent = aiMessage.content;
                setStreamingMessage(null);
                setMessages((prevMessages) => {
                  const assistantMessagesCount = prevMessages.filter(
                    (m) => m.role === "assistant"
                  ).length;
                  if (assistantMessagesCount === 0 && finalContent) {
                    setFirstAiResponseContent(finalContent);
                  }
                  return [...prevMessages, { ...aiMessage, content: finalContent }];
                });
                streamProcessingComplete = true;
                break;
              }

              try {
                const parsedData = JSON.parse(data);
                if (parsedData.error) {
                  setError(`Error from server: ${parsedData.message}`);
                  setStreamingMessage(null);
                  setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                      role: "error",
                      content: parsedData.message,
                      timestamp: new Date(),
                    },
                  ]);
                  streamProcessingComplete = true;
                  break;
                }
                if (parsedData.content) {
                  aiMessage.content += parsedData.content;
                  aiMessage.provider = parsedData.provider;
                  setStreamingMessage({ ...aiMessage });

                  totalTokens += parsedData.content.split(" ").length;
                  const currentTime = Date.now();
                  const elapsedTime = (currentTime - startTime) / 1000;
                  setStats({
                    tokensPerSecond: Math.round(totalTokens / elapsedTime),
                    totalTokens: totalTokens,
                  });
                }
                if (parsedData.fullContent) {
                  const finalContent = parsedData.fullContent;
                  aiMessage.content = finalContent;
                  setStreamingMessage(null);
                  setMessages((prevMessages) => {
                    const assistantMessagesCount = prevMessages.filter(
                      (m) => m.role === "assistant"
                    ).length;
                    if (assistantMessagesCount === 0 && finalContent) {
                      setFirstAiResponseContent(finalContent);
                    }
                    return [...prevMessages, { ...aiMessage }];
                  });
                  streamProcessingComplete = true;
                  break;
                }
              } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                setError(`Error parsing stream data: ${parseError.message}`);
                setStreamingMessage(null);
                streamProcessingComplete = true;
                break;
              }
            }
          }

          if (streamProcessingComplete) {
            break;
          }
        }
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
    [inputValue, messages, selectedModel, systemMessage, userPreferences, onTitleUpdate]
  );

  const chatState = useMemo(
    () => ({
      messages,
      setMessages,
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
      clearError,
      firstAiResponseContent,
      setFirstAiResponseContent,
    }),
    [
      messages,
      streamingMessage,
      inputValue,
      placeholderText,
      error,
      selectedModel,
      isLoading,
      systemMessage,
      stats,
      handleSubmit,
      clearError,
      firstAiResponseContent,
    ]
  );

  return chatState;
};
