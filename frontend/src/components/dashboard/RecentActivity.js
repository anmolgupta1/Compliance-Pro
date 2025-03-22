// components/dashboard/RecentActivity.js
import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Chip,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Business as BusinessIcon,
  People as PeopleIcon,
  Folder as FolderIcon,
  Security as SecurityIcon,
  BugReport as TestingIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

// Mock data - this would come from your API
const mockActivities = [
  { 
    id: 1,
    type: 'company',
    title: 'New Company Registered',
    description: 'Acme Corporation has been registered',
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    icon: <BusinessIcon />,
    iconColor: 'primary'
  },
  { 
    id: 2,
    type: 'user',
    title: 'New User Added',
    description: 'John Smith added to Acme Corporation',
    time: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    icon: <PeopleIcon />,
    iconColor: 'secondary'
  },
  { 
    id: 3,
    type: 'project',
    title: 'New GRC Project Created',
    description: 'PCI DSS Assessment project created for GlobalTech',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    icon: <SecurityIcon />,
    iconColor: 'success'
  },
  { 
    id: 4,
    type: 'project',
    title: 'Testing Project Updated',
    description: 'External Penetration Test scope updated',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    icon: <TestingIcon />,
    iconColor: 'warning'
  },
  { 
    id: 5,
    type: 'project',
    title: 'Project Status Changed',
    description: 'HIPAA Assessment moved to "In Progress"',
    time: new Date(Date.now() - 1000 * 60 * 60 * 28), // 28 hours ago
    icon: <FolderIcon />,
    iconColor: 'info'
  }
];

const ActivityItem = ({ activity }) => {
  const timeAgo = formatDistanceToNow(new Date(activity.time), { addSuffix: true });
  
  return (
    <>
      <ListItem 
        alignItems="flex-start"
        secondaryAction={
          <Tooltip title="More actions">
            <IconButton edge="end" size="small">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
        sx={{ 
          '&:hover': { 
            bgcolor: 'rgba(0, 0, 0, 0.04)' 
          },
          borderRadius: 1,
          my: 0.5
        }}
      >
        <ListItemAvatar>
          <Avatar 
            sx={{ 
              bgcolor: theme => theme.palette[activity.iconColor].light,
              color: theme => theme.palette[activity.iconColor].main
            }}
          >
            {activity.icon}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                {activity.title}
              </Typography>
              <Chip 
                label={activity.type} 
                size="small" 
                sx={{ 
                  height: 20, 
                  fontSize: '0.625rem',
                  bgcolor: theme => theme.palette[activity.iconColor].lighter || theme.palette[activity.iconColor].light,
                  color: theme => theme.palette[activity.iconColor].main,
                  borderRadius: 1
                }} 
              />
            </Box>
          }
          secondary={
            <>
              <Typography
                component="span"
                variant="body2"
                color="text.primary"
                sx={{ display: 'block', mb: 0.5 }}
              >
                {activity.description}
              </Typography>
              <Typography
                component="span"
                variant="caption"
                color="text.secondary"
              >
                {timeAgo}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};

const RecentActivity = ({ activities = mockActivities }) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        height: '100%',
        borderRadius: 2,
        border: theme => `1px solid ${theme.palette.divider}`,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ px: 3, py: 2, bgcolor: 'background.default' }}>
        <Typography variant="h6" fontWeight="600">
          Recent Activity
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Latest updates from across the system
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ 
        p: 0, 
        overflow: 'auto',
        maxHeight: { xs: 300, sm: 400 },
        '&::-webkit-scrollbar': {
          width: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.1)',
          borderRadius: 10
        }
      }}>
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </List>
      
      <Box sx={{ px: 2, py: 1.5, textAlign: 'center', borderTop: theme => `1px solid ${theme.palette.divider}` }}>
        <Typography 
          variant="button" 
          color="primary" 
          sx={{ 
            cursor: 'pointer', 
            '&:hover': { textDecoration: 'underline' } 
          }}
        >
          View All Activity
        </Typography>
      </Box>
    </Paper>
  );
};

export default RecentActivity;