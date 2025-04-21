import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  Toolbar,
  List,
} from '@mui/material';
import { NavItem } from '../../classes/NavItem';
import SideBarItem from './SideBarItem';

const drawerWidth = 240;

type Props = {
    navItems: NavItem[];
}

const SideBar: React.FC<Props> = ({ navItems }) => {
  const location = useLocation();

  return (
    <Box>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navItems.map((item) => (
              <SideBarItem
                label={item.label}
                path={item.path}
                icon={item.icon}
                currentPath={location.pathname}
            />))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SideBar;
