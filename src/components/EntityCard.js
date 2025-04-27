import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const EntityCard = ({ title, icon, description, options = [], onOptionSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleExpand = () => {
    if (options.length > 0) {
      setExpanded(!expanded);
    }
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setExpanded(false);
    onOptionSelect && onOptionSelect(option);
  };

  return (
    <div
      className="w-52 bg-white rounded-2xl shadow-md p-4 border border-gray-200 cursor-grab active:cursor-grabbing relative"
      draggable
      onDragStart={(e) => {
        // You can also pass more data as JSON if needed
        e.dataTransfer.setData('application/reactflow', JSON.stringify({ type: title, option: selectedOption }));
        e.dataTransfer.effectAllowed = 'move';
      }}
    >
      <div className="flex flex-col items-center">
        <div className="text-3xl mb-2">{icon}</div>
        <h3 className="text-lg font-bold">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 text-center">{description}</p>
        )}
      </div>

      {options.length > 0 && (
        <div className="mt-4">
          <button
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            onClick={toggleExpand}
          >
            <span>{selectedOption || 'Select Option'}</span>
            {expanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </button>

          {expanded && (
            <div className="mt-2 bg-white border rounded-md shadow-sm max-h-40 overflow-y-auto z-10">
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EntityCard;
