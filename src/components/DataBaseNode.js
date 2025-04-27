import React from 'react';
import { Handle, Position } from 'reactflow';

const DatabaseNode = ({ data }) => (
  <div className="p-4 bg-yellow-100 border border-yellow-400 rounded shadow text-center">
    <Handle type="target" position={Position.Left} />
    <strong>{data.label}</strong>
    <Handle type="source" position={Position.Right} />
  </div>
);

export default DatabaseNode;
