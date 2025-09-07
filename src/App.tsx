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
import RequireAuth from './auth/RequireAuth';
import Bootstrapper from './auth/Bootstrapper';

const App: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <nav className="mb-6 flex gap-4">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <Link to="/work-sessions" className="text-blue-600 hover:underline">Work Sessions</Link>
      </nav>

      <Bootstrapper />
      
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route
            path="/"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/work-sessions"
            element={
              <RequireAuth>
                <WorkSessionsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/contracts"
            element={
              <RequireAuth>
                <UserContractsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <SettingsPage />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
