// components/dashboard/QuickActions.js
import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Grid,
  IconButton,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { 
  Business as BusinessIcon,
  PersonAdd as PersonAddIcon,
  CreateNewFolder as CreateNewFolderIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  BugReport as BugReportIcon,
  ConfirmationNumber as TicketIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const QuickActionCard = ({ title, icon, path, color }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  return (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: 2,
        height: '100%',
        cursor: 'pointer',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: `${theme.palette[color].main}`,
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[3]
        }
      }}
      onClick={() => navigate(path)}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center'
          }}
        >
          <IconButton
            sx={{
              bgcolor: theme.palette[color].lighter || theme.palette[color].light,
              color: theme.palette[color].main,
              mb: 1,
              '&:hover': {
                bgcolor: theme.palette[color].light
              }
            }}
            size="large"
          >
            {icon}
          </IconButton>
          <Typography variant="body2">
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const QuickActions = ({ userRole = 'super_admin' }) => {
  // Define quick actions based on user role
  const quickActions = [
    {
      title: 'New Company',
      icon: <BusinessIcon />,
      path: '/companies/new',
      color: 'primary',
      roles: ['super_admin']
    },
    {
      title: 'Add User',
      icon: <PersonAddIcon />,
      path: '/users/new',
      color: 'secondary',
      roles: ['super_admin', 'client_admin']
    },
    {
      title: 'New GRC Project',
      icon: <SecurityIcon />,
      path: '/projects/grc/new',
      color: 'success',
      roles: ['super_admin', 'client_admin']
    },
    {
      title: 'New Testing Project',
      icon: <BugReportIcon />,
      path: '/projects/testing/new',
      color: 'warning',
      roles: ['super_admin', 'client_admin']
    },
    {
      title: 'Create Report',
      icon: <AssessmentIcon />,
      path: '/reports/new',
      color: 'info',
      roles: ['super_admin', 'client_admin', 'project_owner', 'auditor']
    },
    {
      title: 'Support Ticket',
      icon: <TicketIcon />,
      path: '/tickets/new',
      color: 'error',
      roles: ['super_admin', 'client_admin', 'project_owner', 'auditor', 'contributor']
    },
    {
      title: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
      color: 'secondary',
      roles: ['super_admin']
    },
    {
      title: 'New Project Type',
      icon: <CreateNewFolderIcon />,
      path: '/project-types/new',
      color: 'info',
      roles: ['super_admin']
    }
  ];

  // Filter actions based on user role
  const filteredActions = quickActions.filter(action => 
    action.roles.includes(userRole)
  );
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        border: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      
      <Grid container spacing={2}>
        {filteredActions.map((action, index) => (
          <Grid item xs={6} sm={3} md={3} key={index}>
            <QuickActionCard
              title={action.title}
              icon={action.icon}
              path={action.path}
              color={action.color}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default QuickActions;