// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Button, Divider, Skeleton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatsCards from '../components/dashboard/StatsCards';
import RecentActivity from '../components/dashboard/RecentActivity';
import DistributionCharts from '../components/dashboard/DistributionCharts';
import QuickActions from '../components/dashboard/QuickActions';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  
  useEffect(() => {
    // Simulate API fetch
    const fetchDashboardData = async () => {
      try {
        // In a real app, this would be an API call
        // await api.get('/dashboard')
        
        // Simulate API delay
        setTimeout(() => {
          setDashboardData({
            stats: {
              totalCompanies: 12,
              totalUsers: 78,
              activeProjects: 24,
              completedProjects: 14,
              projectProgress: 65,
              pendingTickets: 5,
              resolvedTickets: 42
            }
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Check if user has 'super_admin' role
  const isSuperAdmin = user?.role === 'super_admin';
  const welcomeMessage = isSuperAdmin 
    ? 'Welcome to the Admin Dashboard' 
    : 'Welcome to your Dashboard';

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        {/* Welcome Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {welcomeMessage}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>
          <Button variant="contained" color="primary">
            Generate Report
          </Button>
        </Box>
        
        <Divider sx={{ mb: 4 }} />

        {/* Stats Cards */}
        {loading ? (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Skeleton variant="rounded" height={120} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <StatsCards stats={dashboardData?.stats} />
        )}
        
        {/* Quick Actions */}
        <Box sx={{ my: 4 }}>
          {loading ? (
            <Skeleton variant="rounded" height={160} />
          ) : (
            <QuickActions userRole={user?.role} />
          )}
        </Box>
        
        {/* Charts & Activity Section */}
        <Grid container spacing={4}>
          {/* Distribution Charts */}
          <Grid item xs={12} lg={8}>
            {loading ? (
              <Skeleton variant="rounded" height={400} />
            ) : (
              <DistributionCharts />
            )}
          </Grid>
          
          {/* Recent Activity */}
          <Grid item xs={12} lg={4}>
            {loading ? (
              <Skeleton variant="rounded" height={400} />
            ) : (
              <RecentActivity />
            )}
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default Dashboard;