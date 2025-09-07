// src/components/layout/ProfileMenu.tsx
import React, { useState } from "react";
import { Avatar, IconButton, Menu, MenuItem, Box, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useMe } from "../../hooks/useMe";

const ProfileMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { instance } = useMsal();
  const { me, loading } = useMe();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleMenuClose();
    await instance.logoutRedirect({ postLogoutRedirectUri: window.location.origin });
  };

  const open = Boolean(anchorEl);

  // Fallback initial for avatar
  const initial = me?.name?.[0]?.toUpperCase() ?? me?.email?.[0]?.toUpperCase();

  return (
    <Box>
      <IconButton
        onClick={handleMenuOpen}
        size="large"
        edge="end"
        color="inherit"
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar alt={me?.name ?? "User"}>{initial}</Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {loading && (
          <MenuItem disabled>
            <CircularProgress size={18} sx={{ mr: 1 }} /> Loading…
          </MenuItem>
        )}
        {!loading && me && (
          <>
            <MenuItem disabled>{me.name ?? me.email ?? "Unknown user"}</MenuItem>
            <MenuItem component={Link} to="/profile">Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default ProfileMenu;
