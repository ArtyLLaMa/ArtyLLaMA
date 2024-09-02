import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartArtifact = ({ content }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      chartInstance.current = new Chart(ctx, JSON.parse(content));
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [content]);

  return <canvas ref={chartRef} />;
};

export default ChartArtifact;