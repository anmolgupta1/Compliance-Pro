// components/layout/DashboardLayout.js
import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Header from './Header';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Header */}
      <Header 
        isSidebarOpen={isSidebarOpen} 
        onSidebarToggle={handleSidebarToggle} 
      />
      
      {/* Sidebar */}
      <Sidebar 
        open={isSidebarOpen} 
        onClose={handleSidebarToggle} 
      />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: theme.palette.background.default,
          p: 3,
          pt: 10,
          width: { sm: `calc(100% - ${isSidebarOpen ? 240 : 0}px)` },
          ml: { sm: isSidebarOpen ? `240px` : 0 },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;