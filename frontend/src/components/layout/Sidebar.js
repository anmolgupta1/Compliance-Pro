// components/layout/Sidebar.js
import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton, 
  Box, 
  Divider, 
  Toolbar,
  Collapse,
  Typography
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Folder as FolderIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Support as SupportIcon,
  Description as DescriptionIcon,
  BugReport as BugReportIcon,
  Code as CodeIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [projectsOpen, setProjectsOpen] = React.useState(false);
  
  const handleListItemClick = (path) => {
    navigate(path);
    if (window.innerWidth < 600) {
      onClose();
    }
  };

  const toggleProjects = () => {
    setProjectsOpen(!projectsOpen);
  };
  
  const isSuperAdmin = user?.role === 'super_admin';

  // Define menu items
  const primaryMenuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: ['super_admin', 'client_admin', 'project_owner', 'auditor', 'contributor']
    },
    {
      text: 'Companies',
      icon: <BusinessIcon />,
      path: '/companies',
      roles: ['super_admin', 'client_admin']
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/users',
      roles: ['super_admin', 'client_admin']
    },
    {
      text: 'Projects',
      icon: <FolderIcon />,
      hasSubmenu: true,
      roles: ['super_admin', 'client_admin', 'project_owner', 'auditor', 'contributor']
    }
  ];
  
  const projectSubMenuItems = [
    {
      text: 'GRC Projects',
      icon: <SecurityIcon />,
      path: '/projects/grc',
      roles: ['super_admin', 'client_admin', 'project_owner', 'auditor', 'contributor']
    },
    {
      text: 'Testing Projects',
      icon: <BugReportIcon />,
      path: '/projects/testing',
      roles: ['super_admin', 'client_admin', 'project_owner', 'auditor', 'contributor']
    }
  ];
  
  const secondaryMenuItems = [
    {
      text: 'Compliance Standards',
      icon: <DescriptionIcon />,
      path: '/standards',
      roles: ['super_admin']
    },
    {
      text: 'Project Types',
      icon: <CodeIcon />,
      path: '/project-types',
      roles: ['super_admin']
    },
    {
      text: 'Reports',
      icon: <AssessmentIcon />,
      path: '/reports',
      roles: ['super_admin', 'client_admin', 'project_owner', 'auditor']
    },
    {
      text: 'Support Tickets',
      icon: <SupportIcon />,
      path: '/tickets',
      roles: ['super_admin', 'client_admin', 'project_owner', 'auditor', 'contributor']
    },
    {
      text: 'System Settings',
      icon: <SettingsIcon />,
      path: '/settings',
      roles: ['super_admin']
    }
  ];

  // Filter menu items based on user role
  const filteredPrimaryMenuItems = primaryMenuItems.filter(item => 
    item.roles.includes(user?.role || 'contributor')
  );
  
  const filteredProjectSubMenuItems = projectSubMenuItems.filter(item => 
    item.roles.includes(user?.role || 'contributor')
  );
  
  const filteredSecondaryMenuItems = secondaryMenuItems.filter(item => 
    item.roles.includes(user?.role || 'contributor')
  );

  return (
    <Drawer
      variant="persistent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        },
      }}
      anchor="left"
      open={open}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <List component="nav">
          {filteredPrimaryMenuItems.map((item) => (
            item.hasSubmenu ? (
              <React.Fragment key={item.text}>
                <ListItemButton onClick={toggleProjects}>
                  <ListItemIcon sx={{ color: 'secondary.main' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                  {projectsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={projectsOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {filteredProjectSubMenuItems.map((subItem) => (
                      <ListItemButton 
                        key={subItem.text}
                        selected={location.pathname === subItem.path}
                        onClick={() => handleListItemClick(subItem.path)}
                        sx={{ pl: 4 }}
                      >
                        <ListItemIcon sx={{ color: 'primary.main' }}>
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography variant="body2">
                              {subItem.text}
                            </Typography>
                          } 
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ) : (
              <ListItemButton 
                key={item.text}
                selected={location.pathname === item.path}
                onClick={() => handleListItemClick(item.path)}
              >
                <ListItemIcon sx={{ color: 'secondary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            )
          ))}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <List component="nav">
          {filteredSecondaryMenuItems.map((item) => (
            <ListItemButton 
              key={item.text}
              selected={location.pathname === item.path}
              onClick={() => handleListItemClick(item.path)}
            >
              <ListItemIcon sx={{ color: 'secondary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ p: 2, bgcolor: 'background.default', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textAlign: 'center' }}>
            Compliance Pro v1.0
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textAlign: 'center' }}>
            &copy; 2025 CompliancePro
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;