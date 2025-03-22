// components/layout/Header.js
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  Tooltip, 
  Badge, 
  Divider
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ isSidebarOpen, onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationMenu = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleClose();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'secondary.dark', // #222831 from your theme
        color: 'white',
        boxShadow: 3
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onSidebarToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Compliance Pro
        </Typography>
        
        {/* Help Icon */}
        <Tooltip title="Help & Support">
          <IconButton 
            color="inherit"
            size="large"
            sx={{ mr: 2 }}
            onClick={() => navigate('/support')}
          >
            <HelpIcon />
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            size="large"
            color="inherit"
            onClick={handleNotificationMenu}
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={3} color="primary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={notificationAnchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
        >
          <MenuItem onClick={handleNotificationClose}>New company registered</MenuItem>
          <MenuItem onClick={handleNotificationClose}>Project status updated</MenuItem>
          <MenuItem onClick={handleNotificationClose}>System update completed</MenuItem>
          <Divider />
          <MenuItem onClick={handleNotificationClose}>
            <Typography variant="body2" color="primary">View all notifications</Typography>
          </MenuItem>
        </Menu>

        {/* User Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Account settings">
            <IconButton onClick={handleMenu} size="small" sx={{ ml: 2 }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'primary.main',
                  color: 'white',
                  textTransform: 'uppercase'
                }}
              >
                {user?.name ? user.name.charAt(0) : 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem sx={{ pointerEvents: 'none' }}>
            <Typography variant="subtitle2" color="textSecondary">
              {user?.name || 'User'}
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProfile}>
            <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">Profile</Typography>
          </MenuItem>
          <MenuItem onClick={handleSettings}>
            <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">Settings</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;