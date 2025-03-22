// pages/users/EditUser.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button,
  Skeleton,
  Alert,
  Divider,
  Card,
  CardContent,
  Avatar,
  Grid,
  Chip
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import UserForm from '../../components/users/UserForm';
import { useAuth } from '../../context/AuthContext';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // In a real app, this would call your API
        // const response = await userService.getUser(id);
        // setUser(response.user);
        
        // Simulate API call
        setTimeout(() => {
          const mockUser = {
            id: parseInt(id),
            name: 'Sarah Johnson',
            email: 'sarah.johnson@acmecorp.com',
            phone: '(555) 234-5678',
            designation: 'Compliance Manager',
            company_id: 1,
            company: {
              id: 1,
              name: 'Acme Corporation'
            },
            role: 'project_owner',
            is_active: true,
            created_at: '2025-01-20T11:45:00'
          };
          
          setUser(mockUser);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [id]);
  
  const handleUpdateUser = async (data) => {
    setSubmitting(true);
    setFormError(null);
    
    try {
      // In a real app, this would call your API
      // await userService.updateUser(id, data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to user list on success
      navigate('/users', { 
        state: { 
          notification: {
            type: 'success',
            message: 'User updated successfully!'
          }
        }
      });
    } catch (err) {
      console.error('Error updating user:', err);
      setFormError('Failed to update user. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleBackToList = () => {
    navigate('/users');
  };
  
  // Helper function to get role color
  const getRoleColor = (role) => {
    const roleColorMap = {
      'super_admin': 'error',
      'client_admin': 'secondary',
      'project_owner': 'primary',
      'auditor': 'info',
      'contributor': 'success'
    };
    
    return roleColorMap[role] || 'default';
  };
  
  // Helper function to get role label
  const getRoleLabel = (role) => {
    const roleMap = {
      'super_admin': 'Super Admin',
      'client_admin': 'Client Admin',
      'project_owner': 'Project Owner',
      'auditor': 'Auditor',
      'contributor': 'Contributor'
    };
    
    return roleMap[role] || role;
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Check if current user can edit this user
  const canEdit = () => {
    if (!currentUser || !user) return false;
    
    // Super admin can edit anyone
    if (currentUser.role === 'super_admin') return true;
    
    // Client admin can edit users in their company except other client admins
    if (currentUser.role === 'client_admin') {
      return (
        user.company_id === currentUser.company_id &&
        user.role !== 'client_admin' &&
        user.role !== 'super_admin'
      );
    }
    
    // Others can't edit users
    return false;
  };
  
  // Render loading state
  if (loading) {
    return (
      <DashboardLayout>
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width={200} height={40} />
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
          
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={64} height={64} sx={{ mr: 2 }} />
                <Box>
                  <Skeleton variant="text" width={200} />
                  <Skeleton variant="text" width={120} />
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Skeleton variant="text" width="80%" />
                </Grid>
                <Grid item xs={6}>
                  <Skeleton variant="text" width="80%" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          <Skeleton variant="rectangular" height={400} />
        </Container>
      </DashboardLayout>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <DashboardLayout>
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <Button
              variant="text"
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToList}
            >
              Back to Users
            </Button>
          </Box>
          
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Container>
      </DashboardLayout>
    );
  }
  
  // Render user not found
  if (!user) {
    return (
      <DashboardLayout>
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <Button
              variant="text"
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToList}
            >
              Back to Users
            </Button>
          </Box>
          
          <Alert severity="warning" sx={{ mb: 3 }}>
            User not found
          </Alert>
        </Container>
      </DashboardLayout>
    );
  }
  
  // Render permission denied
  if (!canEdit()) {
    return (
      <DashboardLayout>
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <Button
              variant="text"
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToList}
            >
              Back to Users
            </Button>
          </Box>
          
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'secondary.light',
                    color: 'secondary.main',
                    width: 64,
                    height: 64,
                    mr: 2,
                    fontSize: 24
                  }}
                >
                  {user.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box>
                  <Typography variant="h5">{user.name}</Typography>
                  <Chip 
                    label={getRoleLabel(user.role)}
                    color={getRoleColor(user.role)}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body1" color="textSecondary">
                User details: {user.email} | Created: {formatDate(user.created_at)}
              </Typography>
            </CardContent>
          </Card>
          
          <Alert severity="error" sx={{ mb: 3 }}>
            You don't have permission to edit this user
          </Alert>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleBackToList}
          >
            Back to Users
          </Button>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="md">
        {/* Back button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="text"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToList}
          >
            Back to Users
          </Button>
        </Box>
        
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Edit User
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Update details for {user.name}
          </Typography>
        </Box>
        
        {/* User form */}
        <UserForm 
          initialData={{
            name: user.name,
            email: user.email,
            phone: user.phone,
            designation: user.designation,
            company_id: user.company_id,
            role: user.role,
            is_active: user.is_active
          }}
          onSubmit={handleUpdateUser}
          isLoading={submitting}
          error={formError}
          isEditMode={true}
          companies={user.company ? [user.company] : []}
        />
      </Container>
    </DashboardLayout>
  );
};

export default EditUser;