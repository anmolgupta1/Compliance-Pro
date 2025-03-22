import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Chip, 
  Divider, 
  Grid, 
  Paper, 
  Tabs, 
  Tab, 
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
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

// Mock data for a project type
const mockProjectType = {
  id: 1,
  name: 'SOC 2 Type 1',
  description: 'Point-in-time assessment of security controls',
  category: 'GRC',
  isAuditable: true,
  associatedStandards: [
    { id: 1, name: 'SOC 2', version: '2017' }
  ],
  metadata: {
    createdBy: 'John Doe',
    createdAt: '2023-10-15T00:00:00Z',
    updatedBy: 'Jane Smith',
    updatedAt: '2023-11-01T00:00:00Z'
  },
  requiredEvidence: [
    { id: 1, name: 'User Access Review', description: 'Documentation showing periodic review of user access rights' },
    { id: 2, name: 'Change Management Policy', description: 'Documentation of the organization\'s change management process' },
    { id: 3, name: 'Risk Assessment', description: 'Formal assessment of security risks' },
    { id: 4, name: 'Vendor Management', description: 'Process for evaluating and monitoring third-party vendors' }
  ],
  workflowSteps: [
    { id: 1, name: 'Planning', description: 'Define scope and objectives', order: 1 },
    { id: 2, name: 'Evidence Collection', description: 'Gather required documentation', order: 2 },
    { id: 3, name: 'Assessment', description: 'Evaluate evidence against criteria', order: 3 },
    { id: 4, name: 'Reporting', description: 'Document findings and recommendations', order: 4 },
    { id: 5, name: 'Closure', description: 'Review and finalize results', order: 5 }
  ],
  recentProjects: [
    { id: 101, name: 'Acme Corp SOC 2', company: 'Acme Corporation', startDate: '2023-09-01', status: 'In Progress' },
    { id: 102, name: 'TechStart SOC 2', company: 'TechStart Inc.', startDate: '2023-07-15', status: 'Completed' },
    { id: 103, name: 'DataFlow SOC 2', company: 'DataFlow Systems', startDate: '2023-10-05', status: 'Planning' }
  ],
  status: 'active'
};

const ProjectTypeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [projectType, setProjectType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  // Load data
  useEffect(() => {
    // In a real app, this would be an API call based on the ID
    // For now, we'll just use the mock data
    setProjectType(mockProjectType);
    setLoading(false);
  }, [id]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Loading project type details...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  if (!projectType) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Project type not found</Typography>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/project-types')}
            sx={{ mt: 2 }}
          >
            Back to Project Types
          </Button>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header with back button and actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={() => navigate('/project-types')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              {projectType.name}
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/project-types/${id}/edit`)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </Box>
        </Box>

        {/* Project type details card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              {/* Basic information */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {projectType.description}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    label={projectType.category} 
                    sx={{ 
                      backgroundColor: projectType.category === 'GRC' ? '#76ABAE' : '#31363F',
                      color: '#EEEEEE'
                    }} 
                  />
                  <Chip 
                    label={projectType.isAuditable ? 'Auditable' : 'Non-Auditable'} 
                    sx={{
                      backgroundColor: projectType.isAuditable ? '#4caf50' : '#ff9800',
                      color: '#EEEEEE'
                    }}
                  />
                  <Chip 
                    label={projectType.status === 'active' ? 'Active' : 'Inactive'} 
                    color={projectType.status === 'active' ? 'success' : 'error'}
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Associated Standards
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {projectType.associatedStandards.map((standard) => (
                    <Chip 
                      key={standard.id} 
                      label={`${standard.name} (${standard.version})`} 
                      variant="outlined" 
                      onClick={() => navigate(`/standards/${standard.id}`)}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Metadata */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Metadata
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Created By
                    </Typography>
                    <Typography variant="body1">
                      {projectType.metadata.createdBy}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Created On
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(projectType.metadata.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated By
                    </Typography>
                    <Typography variant="body1">
                      {projectType.metadata.updatedBy}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated On
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(projectType.metadata.updatedAt)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs for additional information */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="project type tabs"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab 
              icon={<AssignmentIcon />} 
              iconPosition="start" 
              label="Required Evidence" 
              id="tab-0" 
              aria-controls="tabpanel-0" 
            />
            <Tab 
              icon={<SecurityIcon />} 
              iconPosition="start" 
              label="Workflow Steps" 
              id="tab-1" 
              aria-controls="tabpanel-1" 
            />
            <Tab 
              label="Recent Projects" 
              id="tab-2" 
              aria-controls="tabpanel-2" 
            />
          </Tabs>
        </Box>

        {/* Tab content */}
        <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" aria-labelledby="tab-0">
          {tabValue === 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Evidence Item</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectType.requiredEvidence.map((evidence) => (
                    <TableRow key={evidence.id}>
                      <TableCell>{evidence.name}</TableCell>
                      <TableCell>{evidence.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
        
        <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1" aria-labelledby="tab-1">
          {tabValue === 1 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Step</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectType.workflowSteps.map((step) => (
                    <TableRow key={step.id}>
                      <TableCell>{step.order}</TableCell>
                      <TableCell>{step.name}</TableCell>
                      <TableCell>{step.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
        
        <Box role="tabpanel" hidden={tabValue !== 2} id="tabpanel-2" aria-labelledby="tab-2">
          {tabValue === 2 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Project Name</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectType.recentProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.company}</TableCell>
                      <TableCell>{formatDate(project.startDate)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={project.status} 
                          color={
                            project.status === 'Completed' ? 'success' : 
                            project.status === 'In Progress' ? 'primary' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default ProjectTypeDetail;