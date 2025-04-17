// src/App.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import WorkSessionPage from './pages/WorkSessionPage';

const App: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <nav className="mb-6 flex gap-4">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <Link to="/work-sessions" className="text-blue-600 hover:underline">Work Sessions</Link>
      </nav>

      <Routes>
        <Route path="/work-sessions" element={<WorkSessionPage />} />
      </Routes>
    </div>
  );
};

export default App;
