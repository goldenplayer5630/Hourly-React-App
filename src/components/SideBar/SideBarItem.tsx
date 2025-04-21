import React from 'react';
import { Link } from 'react-router-dom';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

type Props = {
    label: string;
    path: string;
    icon: React.ReactNode;
    currentPath: string;
}

const SideBarItem: React.FC<Props> = ({ label, path, icon, currentPath }) => {
    return (
        <ListItemButton
            key={label}
            component={Link}
            to={path}
            selected={currentPath === path}
            sx={{
                '&.Mui-selected': {
                    backgroundColor: 'action.selected',
                    '&:hover': {
                        backgroundColor: 'action.hover',
                    },
                },
            }}
        >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
        </ListItemButton>
    );
};

export default SideBarItem;

