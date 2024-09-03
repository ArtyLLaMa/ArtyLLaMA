import React from 'react';

const TableArtifact = ({ content }) => {
  console.log("TableArtifact received content:", content);

  let parsedContent;
  try {
    parsedContent = JSON.parse(content);
  } catch (error) {
    console.error("Error parsing table data:", error);
    return <div>Error: Invalid table data</div>;
  }

  if (!parsedContent.headers || !parsedContent.data || !Array.isArray(parsedContent.data)) {
    console.error("Invalid table structure:", parsedContent);
    return <div>Error: Invalid table structure</div>;
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-gray-800 text-gray-200">
        <thead>
          <tr className="bg-gray-700">
            {parsedContent.headers.map((header, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-600">
          {parsedContent.data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750 hover:bg-gray-700'}>
              {parsedContent.headers.map((header, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableArtifact;
