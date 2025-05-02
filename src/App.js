import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import AppLayout from './components/AppLayout';
import LoginSignupPage from './components/Pages/LoginSignupPage';

function App() {
  return (
    <BrowserRouter>
      <ReactFlowProvider>
        <Routes>
          <Route path="/" element={<AppLayout />} />
          <Route path="/auth" element={<LoginSignupPage />} />
        </Routes>
      </ReactFlowProvider>
    </BrowserRouter>
  );
}

export default App;
