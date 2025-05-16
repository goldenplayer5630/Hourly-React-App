// src/App.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import WorkSessionPage from './pages/WorkSessionPage';
import DefaultLayout from './layouts/DefaultLayout';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import GitProjectPage from './pages/GitProjectPage';
import SettingsPage from './pages/SettingsPage';
import ContractsPage from './pages/ContractsPage';

const App: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <nav className="mb-6 flex gap-4">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <Link to="/work-sessions" className="text-blue-600 hover:underline">Work Sessions</Link>
      </nav>

      <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<DashboardPage/>} />
        <Route path="/git-projects" element={<GitProjectPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/work-sessions" element={<WorkSessionPage />} />
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
    </div>
  );
};

export default App;
