// pages/companies/CompanyDetail.js
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
  CardHeader,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Work as WorkIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  BugReport as BugReportIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { companyService } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        // In a real app, this would fetch from your API
        // const response = await companyService.getCompany(id);
        // setCompany(response.company);
        
        // Simulated data
        setTimeout(() => {
          const mockCompany = {
            id: parseInt(id),
            name: 'Acme Corporation',
            logo_path: null,
            address: '123 Main Street, Metropolis',
            email: 'info@acmecorp.com',
            phone: '(555) 123-4567',
            created_at: '2025-01-10T08:30:00',
            is_active: true,
            users: [
              {
                id: 1,
                name: 'John Smith',
                email: 'john.smith@acmecorp.com',
                role: 'client_admin',
                status: 'active'
              },
              {
                id: 2,
                name: 'Sarah Johnson',
                email: 'sarah.johnson@acmecorp.com',
                role: 'project_owner',
                status: 'active'
              },
              {
                id: 3,
                name: 'Michael Brown',
                email: 'michael.brown@acmecorp.com',
                role: 'contributor',
                status: 'active'
              },
              {
                id: 4,
                name: 'Emily Davis',
                email: 'emily.davis@acmecorp.com',
                role: 'auditor',
                status: 'inactive'
              }
            ],
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
              },
              {
                id: 3,
                name: 'HIPAA Assessment',
                type: 'GRC',
                status: 'on_hold',
                created_at: '2025-03-01T09:15:00',
                progress: 20
              }
            ]
          };
          
          setCompany(mockCompany);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching company details:', error);
        setLoading(false);
      }
    };
    
    fetchCompanyDetails();
  }, [id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleEditCompany = () => {
    navigate(`/companies/${id}/edit`);
  };
  
  const handleDeleteCompany = () => {
    // In a real app, this would call your API
    // await companyService.deleteCompany(id);
    navigate('/companies');
  };
  
  const handleAddUser = () => {
    navigate(`/companies/${id}/users/new`);
  };
  
  const handleAddProject = () => {
    navigate(`/companies/${id}/projects/new`);
  };
  
  const handleBackToList = () => {
    navigate('/companies');
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
          
          <Grid container spacing={3}>
            {Array.from(new Array(3)).map((_, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Skeleton variant="rectangular" height={200} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </DashboardLayout>
    );
  }
  
  // If company not found
  if (!company) {
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Company not found
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToList}
            >
              Back to Companies
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
            Back to Companies
          </Button>
        </Box>
        
        {/* Company header */}
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
                  variant="rounded" 
                  sx={{ 
                    bgcolor: 'primary.light', 
                    color: 'primary.main',
                    width: 64, 
                    height: 64,
                    mr: 2,
                    fontSize: 32
                  }}
                >
                  {company.name.charAt(0)}
                </Avatar>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, mr: 1.5 }}>
                      {company.name}
                    </Typography>
                    <Chip 
                      label={company.is_active ? 'Active' : 'Inactive'} 
                      size="small"
                      sx={{
                        bgcolor: company.is_active ? 'success.lighter' : 'error.lighter',
                        color: company.is_active ? 'success.main' : 'error.main',
                        fontWeight: 500,
                        borderRadius: 1
                      }}
                    />
                  </Box>
                  <Typography variant="body1" color="textSecondary">
                    {company.address}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {company.email}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {company.phone}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Created on {formatDate(company.created_at)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mb: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={handleEditCompany}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteCompany}
                >
                  Delete
                </Button>
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
                    Company Overview
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <GroupIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4">
                          {company.users.length}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Users
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <WorkIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4">
                          {company.projects.length}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Projects
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <SecurityIcon color="success" sx={{ fontSize: 24, mb: 0.5 }} />
                        <Typography variant="h6">
                          {company.projects.filter(p => p.type === 'GRC').length}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          GRC Projects
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <BugReportIcon color="error" sx={{ fontSize: 24, mb: 0.5 }} />
                        <Typography variant="h6">
                          {company.projects.filter(p => p.type === 'Testing').length}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Testing Projects
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Tabs for users and projects */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="company tabs">
            <Tab label="Users" />
            <Tab label="Projects" />
          </Tabs>
        </Box>
        
        {/* Tab content */}
        {tabValue === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddUser}
              >
                Add User
              </Button>
            </Box>
            
            <TableContainer 
              component={Paper} 
              elevation={0}
              sx={{ 
                borderRadius: 2,
                border: theme => `1px solid ${theme.palette.divider}`,
                mb: 3
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="users table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {company.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'secondary.light', 
                              color: 'secondary.main',
                              width: 32, 
                              height: 32,
                              mr: 1.5,
                              fontSize: 14
                            }}
                          >
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Typography variant="body2">
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role.replace('_', ' ')} 
                          size="small"
                          sx={{
                            bgcolor: 'primary.lighter',
                            color: 'primary.main',
                            textTransform: 'capitalize',
                            borderRadius: 1
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.status} 
                          size="small"
                          sx={{
                            bgcolor: user.status === 'active' ? 'success.lighter' : 'error.lighter',
                            color: user.status === 'active' ? 'success.main' : 'error.main',
                            textTransform: 'capitalize',
                            borderRadius: 1
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit User">
                          <IconButton 
                            size="small"
                            onClick={() => navigate(`/users/${user.id}/edit`)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {company.users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                        <Typography variant="body1">No users found</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Add users to this company
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddProject}
              >
                Add Project
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {company.projects.map((project) => (
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
                    <CardHeader
                      avatar={
                        <Avatar 
                          sx={{ 
                            bgcolor: project.type === 'GRC' ? 'success.lighter' : 'warning.lighter',
                            color: project.type === 'GRC' ? 'success.main' : 'warning.main'
                          }}
                        >
                          {project.type === 'GRC' ? <SecurityIcon /> : <BugReportIcon />}
                        </Avatar>
                      }
                      title={
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                          {project.name}
                        </Typography>
                      }
                      subheader={`Created on ${formatDate(project.created_at)}`}
                      action={
                        <Tooltip title="Edit Project">
                          <IconButton 
                            size="small"
                            onClick={() => navigate(`/projects/${project.id}/edit`)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      }
                    />
                    <CardContent>
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
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              
              {company.projects.length === 0 && (
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
                      Add projects to this company
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default CompanyDetail;