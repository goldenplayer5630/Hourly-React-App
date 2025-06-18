// src/App.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import WorkSessionsPage from './pages/work-sessions';
import DefaultLayout from './layouts/DefaultLayout';
import DashboardPage from './pages/dashboard';
import ProfilePage from './pages/profile';
import GitProjectsPage from './pages/git-projects';
import SettingsPage from './pages/settings';
import UserContractsPage from './pages/user-contracts';

const App: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <nav className="mb-6 flex gap-4">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <Link to="/work-sessions" className="text-blue-600 hover:underline">Work Sessions</Link>
      </nav>

      <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/git-projects" element={<GitProjectsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/work-sessions" element={<WorkSessionsPage />} />
        <Route path="/contracts" element={<UserContractsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
    </div>
  );
};

export default App;
