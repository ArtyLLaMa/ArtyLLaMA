import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

function safeJSONParse(content) {
    if (typeof content !== 'string') {
      console.error("Invalid input: expected string, got", typeof content);
      return null;
    }
  
    // Check if the content starts with '<', indicating it might be HTML
    if (content.trim().startsWith('<')) {
      console.log("Received HTML content instead of JSON");
      return { type: 'html', content: content };
    }
  
    // Check for the <antArtifact> tag and extract its content
    const artifactMatch = content.match(/<antArtifact[^>]*>([\s\S]*?)<\/antArtifact>/i);
    if (artifactMatch) {
      const artifactContent = artifactMatch[1];
      const jsonMatch = artifactContent.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (error) {
          console.error("JSON parsing error within <antArtifact>:", error);
        }
      }
    }
  
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error("JSON parsing error:", error);
      console.log("Problematic content:", content);
      return null;
    }
}

function validateChartData(data) {
    if (data && data.type === 'html') {
      return true; // It's valid HTML content
    }
  
    if (!data || typeof data !== 'object' || !data.type || !data.data) {
      console.error("Invalid chart data structure");
      return false;
    }
  
    if (data.type === "bar" || data.type === "line") {
      if (!Array.isArray(data.data.labels) || !Array.isArray(data.data.datasets)) {
        console.error("Invalid chart data structure for bar/line chart");
        return false;
      }
    }
  
    return true;
}

function getFallbackChartData() {
  return {
    type: "bar",
    data: {
      labels: ["Fallback 1", "Fallback 2", "Fallback 3"],
      datasets: [{
        label: "Fallback Dataset",
        data: [10, 20, 15],
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true },
        x: { title: { display: true, text: "Categories" } }
      },
      plugins: { title: { display: true, text: "Fallback Chart - Invalid Data Provided" } }
    }
  };
}

const ChartArtifact = ({ content }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [error, setError] = useState(null);
  const [showRawContent, setShowRawContent] = useState(false);
  const [htmlContent, setHtmlContent] = useState(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
  
      const parsedData = safeJSONParse(content);
      
      if (parsedData && validateChartData(parsedData)) {
        if (parsedData.type === 'html') {
          setHtmlContent(parsedData.content);
          setError("Received HTML content instead of chart data.");
        } else {
          // Create new chart
          try {
            chartInstance.current = new Chart(ctx, {
              type: parsedData.type,
              data: parsedData.data,
              options: parsedData.options || {}
            });
          } catch (chartError) {
            console.error("Error creating chart:", chartError);
            setError("Failed to create chart. Please try again or use a different model.");
          }
        }
      } else {
        console.warn("Using fallback chart data due to invalid model response");
        chartInstance.current = new Chart(ctx, getFallbackChartData());
        setError("Invalid chart data received. Displaying fallback chart.");
      }
    }
  
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [content]);

  return (
    <div className="chart-artifact">
      {error && (
        <div className="error-message bg-red-600 text-white p-2 rounded mb-2">
          {error}
          <button 
            onClick={() => setShowRawContent(!showRawContent)}
            className="ml-2 px-2 py-1 bg-red-700 rounded hover:bg-red-800 transition-colors"
          >
            {showRawContent ? "Hide" : "Show"} Raw Content
          </button>
        </div>
      )}
      {showRawContent && (
        <pre className="raw-content bg-gray-900 p-4 rounded overflow-auto max-h-60 mb-2 text-sm">
          {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
        </pre>
      )}
      {htmlContent ? (
        <div className="html-content bg-white p-4 rounded" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      ) : (
        <canvas ref={chartRef} />
      )}
    </div>
  );
};

export default ChartArtifact;
