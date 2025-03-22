// components/dashboard/StatsCards.js
import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  LinearProgress, 
  Divider,
  useTheme
} from '@mui/material';
import { 
  Business as BusinessIcon,
  People as PeopleIcon,
  Folder as FolderIcon,
  ConfirmationNumber as TicketIcon
} from '@mui/icons-material';

const StatsCard = ({ title, value, icon, color, progress, secondaryValue, secondaryLabel }) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        height: '100%',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          boxShadow: 3,
          borderColor: 'transparent'
        },
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: `${color}.light`, 
            color: `${color}.main`,
            borderRadius: 1.5,
            p: 1,
            mr: 2
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="600">
            {value}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {title}
          </Typography>
        </Box>
      </Box>
      
      {progress !== undefined && (
        <Box sx={{ mt: 2, mb: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 5,
              bgcolor: theme.palette.grey[100],
              '& .MuiLinearProgress-bar': {
                bgcolor: `${color}.main`,
                borderRadius: 5,
              }
            }} 
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" color="textSecondary">Progress</Typography>
            <Typography variant="caption" color="textSecondary">{progress}%</Typography>
          </Box>
        </Box>
      )}
      
      {secondaryValue && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              {secondaryLabel}
            </Typography>
            <Typography variant="body2" fontWeight="medium" color={color + '.main'}>
              {secondaryValue}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

const StatsCards = ({ stats = {} }) => {
  // Default values if no stats are provided
  const {
    totalCompanies = 12,
    totalUsers = 78,
    activeProjects = 24,
    completedProjects = 14,
    projectProgress = 65,
    pendingTickets = 5,
    resolvedTickets = 42
  } = stats;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Companies"
          value={totalCompanies}
          icon={<BusinessIcon />}
          color="primary"
          secondaryValue="3 new this month"
          secondaryLabel="Growth"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={<PeopleIcon />}
          color="secondary"
          secondaryValue="15 active now"
          secondaryLabel="Online"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Active Projects"
          value={activeProjects}
          icon={<FolderIcon />}
          color="info"
          progress={projectProgress}
          secondaryValue={`${completedProjects} completed`}
          secondaryLabel="Status"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Support Tickets"
          value={pendingTickets}
          icon={<TicketIcon />}
          color="error"
          secondaryValue={`${resolvedTickets} resolved`}
          secondaryLabel="Total"
        />
      </Grid>
    </Grid>
  );
};

export default StatsCards;