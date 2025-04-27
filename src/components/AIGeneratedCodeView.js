import React from 'react';

const AIGeneratedCodeView = ({ code, onBack, onDownload }) => {
  return (
    <div className="w-full h-full bg-white p-6 overflow-auto">
      <div className="flex justify-between mb-4">
        <button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          ⬅️ Back to Canvas
        </button>
        <button onClick={onDownload} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          📄 Download PDF
        </button>
      </div>

      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  );
};

export default AIGeneratedCodeView;
