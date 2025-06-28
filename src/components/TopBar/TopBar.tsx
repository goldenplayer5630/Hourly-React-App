import React from 'react';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
} from '@mui/material';
import ThemeToggleButton from './ThemeToggleButton';

const TopBar: React.FC = () => {
    return (
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
    
          {/* App Bar */}
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" noWrap>
                Hourly
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                <ThemeToggleButton />
                <ProfileMenu />
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
      );
}

export default TopBar;
