import React, { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';

const MicroserviceNode = ({ id, data, selected }) => {
  const [fields, setFields] = useState(data.fields || [{ name: '', type: 'String' }]);

  // 🔁 Sync internal field state with React Flow node data
  useEffect(() => {
    if (JSON.stringify(fields) !== JSON.stringify(data.fields)) {
      data.fields = fields;
    }
  }, [fields, data]);
  

  const addField = () => {
    setFields((prev) => [...prev, { name: '', type: 'String' }]);
  };

  const removeField = (indexToRemove) => {
    setFields((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const updateField = (index, key, value) => {
    setFields((prev) => {
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  };

  return (
    <div className={`bg-white border rounded-md p-3 shadow-md min-w-[280px] relative ${selected ? 'border-blue-600' : 'border-blue-400'}`}>
      {/* Node handles for microservice */}
      <Handle
        type="target"
        position={Position.Left}
        id="microservice-in"
        style={{ top: '10px', background: '#10b981' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="microservice-out"
        style={{ top: '10px', background: '#3b82f6' }}
      />

      <div className="text-sm font-semibold text-blue-600 mb-2">
        🧩 {data.label || 'Microservice'}
      </div>

      {fields.map((field, index) => (
        <div key={index} className="flex items-center justify-between mb-1 relative px-2">
          {/* Field handles */}
          <Handle
            type="target"
            position={Position.Left}
            id={`field-in-${index}`}
            isConnectable={true}
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#34d399',
              left: '-6px',
              width: 10,
              height: 10,
              borderRadius: '50%',
            }}
          />

          {/* Field name input */}
          <input
            className="border rounded px-2 py-1 w-24 text-xs mx-1"
            placeholder="field name"
            value={field.name}
            onChange={(e) => updateField(index, 'name', e.target.value)}
          />

          {/* Field type dropdown */}
          <select
            className="border rounded px-1 py-1 text-xs"
            value={field.type}
            onChange={(e) => updateField(index, 'type', e.target.value)}
          >
            <option value="String">String</option>
            <option value="Integer">Integer</option>
            <option value="Boolean">Boolean</option>
            <option value="Long">Long</option>
            <option value="Double">Double</option>
            <option value="Character">Character</option>
          </select>

          {/* ❌ remove field */}
          <button
            onClick={() => removeField(index)}
            className="text-red-500 text-xs ml-2 hover:text-red-700"
            title="Remove field"
          >
            ❌
          </button>

          <Handle
            type="source"
            position={Position.Right}
            id={`field-out-${index}`}
            isConnectable={true}
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#3b82f6',
              right: '-6px',
              width: 10,
              height: 10,
              borderRadius: '50%',
            }}
          />
        </div>
      ))}

      {/* ➕ Add field button */}
      <button
        className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        onClick={addField}
      >
        ➕ Add Field
      </button>
    </div>
  );
};

export default MicroserviceNode;
