// pages/users/UserDetail.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Divider,
  Tabs,
  Tab,
  Skeleton,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  Work as WorkIcon,
  Event as EventIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  BugReport as BugReportIcon,
  ArrowBack as ArrowBackIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // In a real app, this would fetch from your API
        // const response = await userService.getUser(id);
        // setUser(response.user);
        
        // Simulated data
        setTimeout(() => {
          const mockUser = {
            id: parseInt(id),
            name: 'Sarah Johnson',
            email: 'sarah.johnson@acmecorp.com',
            phone: '(555) 234-5678',
            designation: 'Compliance Manager',
            company: {
              id: 1,
              name: 'Acme Corporation'
            },
            role: 'project_owner',
            status: 'active',
            created_at: '2025-01-20T11:45:00',
            last_login: '2025-03-10T14:22:00',
            projects: [
              {
                id: 1,
                name: 'PCI DSS Compliance',
                type: 'GRC',
                status: 'in_progress',
                created_at: '2025-02-01T10:00:00',
                progress: 65
              },
              {
                id: 2,
                name: 'External Penetration Test',
                type: 'Testing',
                status: 'in_progress',
                created_at: '2025-02-15T14:30:00',
                progress: 40
              }
            ],
            // pages/users/UserDetail.js (continued)
            activity: [
                {
                  id: 1,
                  action: 'Uploaded evidence',
                  item: 'Network Diagram',
                  project: 'PCI DSS Compliance',
                  timestamp: '2025-03-09T15:45:00'
                },
                {
                  id: 2,
                  action: 'Updated action item',
                  item: 'Firewall Configuration',
                  project: 'PCI DSS Compliance',
                  timestamp: '2025-03-08T11:30:00'
                },
                {
                  id: 3,
                  action: 'Added comment',
                  item: 'External Scan Results',
                  project: 'External Penetration Test',
                  timestamp: '2025-03-07T14:20:00'
                },
                {
                  id: 4,
                  action: 'Approved evidence',
                  item: 'Security Policy',
                  project: 'PCI DSS Compliance',
                  timestamp: '2025-03-05T09:15:00'
                }
              ]
            };
            
            setUser(mockUser);
            setLoading(false);
          }, 1000);
        } catch (error) {
          console.error('Error fetching user details:', error);
          setLoading(false);
        }
      };
      
      fetchUserDetails();
    }, [id]);
    
    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
    };
    
    const handleEditUser = () => {
      navigate(`/users/${id}/edit`);
    };
    
    const handleDeleteUser = () => {
      // Close dialog
      setDeleteDialogOpen(false);
      
      // In a real app, this would call your API
      // await userService.deleteUser(id);
      
      // Navigate to user list
      navigate('/users', {
        state: {
          notification: {
            type: 'success',
            message: 'User deleted successfully'
          }
        }
      });
    };
    
    const handleToggleUserStatus = () => {
      // Close dialog
      setStatusDialogOpen(false);
      
      // In a real app, this would call your API
      // await userService.toggleUserStatus(id);
      
      // Update local state
      setUser(prev => ({
        ...prev,
        status: prev.status === 'active' ? 'inactive' : 'active'
      }));
    };
    
    const handleBackToList = () => {
      navigate('/users');
    };
    
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    };
    
    const formatDateTime = (dateString) => {
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleString('en-US', options);
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
    
    // Check if current user can edit this user
    const canEdit = () => {
      if (!currentUser || !user) return false;
      
      // Super admin can edit anyone
      if (currentUser.role === 'super_admin') return true;
      
      // Client admin can edit users in their company except other client admins
      if (currentUser.role === 'client_admin') {
        return (
          user.company && 
          user.company.id === currentUser.company_id &&
          user.role !== 'client_admin' &&
          user.role !== 'super_admin'
        );
      }
      
      // Others can't edit users
      return false;
    };
    
    // Render loading skeleton
    if (loading) {
      return (
        <DashboardLayout>
          <Container maxWidth="xl">
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Skeleton variant="text" width={200} height={40} />
            </Box>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Skeleton variant="rectangular" height={180} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="70%" />
                </Grid>
              </Grid>
            </Paper>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Skeleton variant="rectangular" height={48} />
            </Box>
            
            <Skeleton variant="rectangular" height={300} />
          </Container>
        </DashboardLayout>
      );
    }
    
    // If user not found
    if (!user) {
      return (
        <DashboardLayout>
          <Container maxWidth="xl">
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                User not found
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToList}
              >
                Back to Users
              </Button>
            </Paper>
          </Container>
        </DashboardLayout>
      );
    }
    
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
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
          
          {/* User header */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2,
              border: theme => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 600, mr: 1.5 }}>
                        {user.name}
                      </Typography>
                      <Chip 
                        label={user.status} 
                        size="small"
                        sx={{
                          bgcolor: user.status === 'active' ? 'success.lighter' : 'error.lighter',
                          color: user.status === 'active' ? 'success.main' : 'error.main',
                          fontWeight: 500,
                          borderRadius: 1,
                          textTransform: 'capitalize'
                        }}
                      />
                    </Box>
                    <Typography variant="h6" color="textSecondary">
                      {getRoleLabel(user.role)}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {user.email}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {user.phone || 'No phone number'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BusinessIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {user.company ? user.company.name : 'System User'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BadgeIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {user.designation || 'No designation'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WorkIcon color="action" sx={{ mr: 1 }} />
                      <Chip 
                        label={getRoleLabel(user.role)} 
                        size="small"
                        color={getRoleColor(user.role)}
                        sx={{
                          textTransform: 'capitalize'
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EventIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Created on {formatDate(user.created_at)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mb: 2 }}>
                  {canEdit() && (
                    <>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={handleEditUser}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color={user.status === 'active' ? 'error' : 'success'}
                        startIcon={user.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                        onClick={() => setStatusDialogOpen(true)}
                        sx={{ mr: 1 }}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Box>
                
                <Card 
                  elevation={0}
                  sx={{ 
                    borderRadius: 2,
                    border: theme => `1px solid ${theme.palette.divider}`,
                    mb: { xs: 2, md: 0 },
                    height: { md: '70%' }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      User Summary
                    </Typography>
                    
                    <Grid container spacing={3} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4">
                            {user.projects.length}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Projects
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4">
                            {user.activity.length}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Recent Activities
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Last Login
                      </Typography>
                      <Typography variant="body2">
                        {user.last_login ? formatDateTime(user.last_login) : 'Never logged in'}
                      </Typography>
                    </Box>
                    
                    {user.company && (
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="text"
                          color="primary"
                          endIcon={<LaunchIcon />}
                          size="small"
                          onClick={() => navigate(`/companies/${user.company.id}`)}
                        >
                          View Company Details
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Tabs for projects and activity */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="user tabs">
              <Tab label="Projects" />
              <Tab label="Activity" />
            </Tabs>
          </Box>
          
          {/* Tab content */}
          {tabValue === 0 && (
            <Box>
              <Grid container spacing={3}>
                {user.projects.map((project) => (
                  <Grid item xs={12} md={4} key={project.id}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 2,
                        border: theme => `1px solid ${theme.palette.divider}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateY(-4px)',
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: project.type === 'GRC' ? 'success.lighter' : 'warning.lighter',
                              color: project.type === 'GRC' ? 'success.main' : 'warning.main',
                              mr: 2
                            }}
                          >
                            {project.type === 'GRC' ? <SecurityIcon /> : <BugReportIcon />}
                          </Avatar>
                          <Box>
                            <Typography variant="h6">
                              {project.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Created on {formatDate(project.created_at)}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" color="textSecondary">
                              Progress
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {project.progress}%
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              width: '100%',
                              height: 8,
                              borderRadius: 4,
                              bgcolor: 'grey.100',
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: `${project.progress}%`,
                                bgcolor: project.type === 'GRC' ? 'success.main' : 'warning.main',
                                borderRadius: 4
                              }}
                            />
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip 
                            label={project.type} 
                            size="small"
                            sx={{
                              bgcolor: project.type === 'GRC' ? 'success.lighter' : 'warning.lighter',
                              color: project.type === 'GRC' ? 'success.main' : 'warning.main',
                              borderRadius: 1
                            }}
                          />
                          <Chip 
                            label={project.status.replace('_', ' ')} 
                            size="small"
                            sx={{
                              bgcolor: 
                                project.status === 'in_progress' ? 'info.lighter' : 
                                project.status === 'on_hold' ? 'warning.lighter' : 
                                project.status === 'completed' ? 'success.lighter' : 'error.lighter',
                              color: 
                                project.status === 'in_progress' ? 'info.main' : 
                                project.status === 'on_hold' ? 'warning.main' : 
                                project.status === 'completed' ? 'success.main' : 'error.main',
                              textTransform: 'capitalize',
                              borderRadius: 1
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => navigate(`/projects/${project.id}`)}
                          >
                            View Project
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                
                {user.projects.length === 0 && (
                  <Grid item xs={12}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        borderRadius: 2,
                        border: theme => `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="body1">No projects found</Typography>
                      <Typography variant="body2" color="textSecondary">
                        This user is not assigned to any projects yet
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
          
          {tabValue === 1 && (
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: 2,
                border: theme => `1px solid ${theme.palette.divider}`,
                overflow: 'hidden'
              }}
            >
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="activity table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Project</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user.activity.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{activity.action}</TableCell>
                        <TableCell>{activity.item}</TableCell>
                        <TableCell>{activity.project}</TableCell>
                        <TableCell>{formatDateTime(activity.timestamp)}</TableCell>
                      </TableRow>
                    ))}
                    
                    {user.activity.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3 }}>
                          <Typography variant="body1">No activity found</Typography>
                          <Typography variant="body2" color="textSecondary">
                            This user has not performed any actions yet
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
          
          {/* Delete confirmation dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">
              Delete User
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-dialog-description">
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteUser} color="error" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* Status change confirmation dialog */}
          <Dialog
            open={statusDialogOpen}
            onClose={() => setStatusDialogOpen(false)}
            aria-labelledby="status-dialog-title"
            aria-describedby="status-dialog-description"
          >
            <DialogTitle id="status-dialog-title">
              {user.status === 'active' ? 'Deactivate' : 'Activate'} User
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="status-dialog-description">
                {user.status === 'active' 
                  ? 'Are you sure you want to deactivate this user? They will no longer be able to log in to the system.'
                  : 'Are you sure you want to activate this user? They will be able to log in to the system.'}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleToggleUserStatus} 
                color={user.status === 'active' ? 'error' : 'success'} 
                autoFocus
              >
                {user.status === 'active' ? 'Deactivate' : 'Activate'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </DashboardLayout>
    );
  };
  
  export default UserDetail;