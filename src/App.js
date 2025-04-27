import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import AppLayout from './components/AppLayout';

function App() {
  return (
    <ReactFlowProvider>
      <AppLayout />
    </ReactFlowProvider>
  );
}

export default App;
