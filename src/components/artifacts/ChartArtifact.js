import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

function safeJSONParse(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("JSON parsing error:", error);
    console.log("Problematic JSON string:", jsonString);
    return null;
  }
}

function validateChartData(data) {
  if (!data || typeof data !== 'object' || !data.type || !data.data || !Array.isArray(data.data)) {
    console.error("Invalid chart data structure");
    return false;
  }

  if (data.type === "bar" || data.type === "line") {
    if (!data.data.every(item => item.label && Array.isArray(item.data))) {
      console.error("Invalid chart data");
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

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const parsedData = safeJSONParse(content);
      let chartData;

      if (parsedData && validateChartData(parsedData)) {
        chartData = parsedData;
      } else {
        console.warn("Using fallback chart data due to invalid model response");
        chartData = getFallbackChartData();
        setError("Invalid chart data received. Displaying fallback chart.");
      }

      // Create new chart
      try {
        chartInstance.current = new Chart(ctx, chartData);
      } catch (chartError) {
        console.error("Error creating chart:", chartError);
        setError("Failed to create chart. Please try again or use a different model.");
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
    <div>
      {error && <div className="error-message">{error}</div>}
      <canvas ref={chartRef} />
    </div>
  );
};

export default ChartArtifact;
