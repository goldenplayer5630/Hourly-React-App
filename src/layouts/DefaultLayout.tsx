// src/layouts/DefaultLayout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../components/TopBar/TopBar';
import {
  Box,
  CssBaseline,
} from '@mui/material';
import SideBar from '../components/SideBar/SideBar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimerIcon from '@mui/icons-material/Timer';
import DocumentIcon from '@mui/icons-material/Description';
import GitHubIcon from '@mui/icons-material/GitHub';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavItem } from '../classes/NavItem';

const navItems = [
  new NavItem('Dashboard', '/', <DashboardIcon />),
  new NavItem('Work Sessions', '/work-sessions', <TimerIcon />),
  new NavItem('Git Projects', '/git-projects', <GitHubIcon />),
  new NavItem('Contracts', '/contracts', <DocumentIcon />),
  new NavItem('Settings', '/settings', <SettingsIcon />),
];

const DefaultLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* App Bar */}
      <TopBar />

      {/* Sidebar */}
      <SideBar navItems={navItems} />

      {/* Page Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DefaultLayout;
