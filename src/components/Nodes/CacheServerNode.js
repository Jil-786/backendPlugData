// ./Nodes/CacheServerNode.jsx
import React from 'react';
import { Handle, Position } from 'reactflow';

const CacheServerNode = ({ data }) => (
  <div className="p-4 bg-purple-100 border border-purple-400 rounded shadow text-center">
    <Handle type="target" position={Position.Left} />
    <strong>{data.label}</strong>
    {/* <p className="text-xs text-purple-700 mt-1">{data.option || 'Redis'}</p> */}
    <Handle type="source" position={Position.Right} />
  </div>
);

export default CacheServerNode;
