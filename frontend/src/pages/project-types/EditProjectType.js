import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProjectTypeForm from '../../components/project-types/ProjectTypeForm';

// Mock data for a project type
const mockProjectType = {
  id: 1,
  name: 'SOC 2 Type 1',
  description: 'Point-in-time assessment of security controls',
  category: 'GRC',
  isAuditable: true,
  associatedStandards: [
    { id: 1, name: 'SOC 2', version: '2017', description: 'Service Organization Control' }
  ],
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
  status: 'active'
};

const EditProjectType = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for loading
  const [loading, setLoading] = useState(true);
  
  // State for project type data
  const [projectTypeData, setProjectTypeData] = useState(null);
  
  // Load project type data
  useEffect(() => {
    // In a real app, this would be an API call based on the ID
    // For now, we'll just use the mock data
    setTimeout(() => {
      setProjectTypeData(mockProjectType);
      setLoading(false);
    }, 1000); // Simulate API delay
  }, [id]);
  
  // Handle form submission
  const handleSubmit = (formData) => {
    // In a real app, this would make an API call to update the project type
    console.log('Updating project type with data:', formData);
    
    // Navigate back to the detail view
    navigate(`/project-types/${id}`);
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header with back button */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={() => navigate(`/project-types/${id}`)}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Edit Project Type
          </Typography>
        </Box>
        
        {/* Form */}
        <Card>
          <CardContent>
            <ProjectTypeForm 
              initialData={projectTypeData}
              onSubmit={handleSubmit}
              submitButtonText="Save Changes"
            />
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default EditProjectType;