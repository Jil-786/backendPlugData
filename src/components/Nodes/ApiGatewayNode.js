import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const ApiGatewayNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();

  const handleDiscoveryChange = (e) => {
    const newDiscoveryType = e.target.value;

    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                discoveryType: newDiscoveryType,
              },
            }
          : node
      )
    );
  };

  return (
    <div className="p-4 bg-blue-200 border border-blue-400 rounded shadow text-center">
      <Handle type="target" position={Position.Left} />
      <strong>{data.label}</strong>

      <div className="mt-2">
        <label className="text-sm text-gray-700">Discovery:</label>
        <select
          value={data.discoveryType || 'None'}
          onChange={handleDiscoveryChange}
          className="ml-2 px-2 py-1 border rounded text-sm"
        >
          <option value="None">None</option>
          <option value="Eureka">Eureka</option>
          <option value="Consul">Consul</option>
        </select>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default ApiGatewayNode;
