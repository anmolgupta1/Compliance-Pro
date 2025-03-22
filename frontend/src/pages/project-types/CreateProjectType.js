import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProjectTypeForm from '../../components/project-types/ProjectTypeForm';

const CreateProjectType = () => {
  const navigate = useNavigate();
  
  // Initial data for the form
  const initialData = {
    name: '',
    description: '',
    category: 'GRC',
    isAuditable: true,
    status: 'active',
    associatedStandards: [],
    requiredEvidence: [],
    workflowSteps: []
  };
  
  // Handle form submission
  const handleSubmit = (formData) => {
    // In a real app, this would make an API call to create the project type
    console.log('Creating project type with data:', formData);
    
    // Navigate back to the list view
    navigate('/project-types');
  };
  
  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header with back button */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={() => navigate('/project-types')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Create Project Type
          </Typography>
        </Box>
        
        {/* Form */}
        <Card>
          <CardContent>
            <ProjectTypeForm 
              initialData={initialData}
              onSubmit={handleSubmit}
              submitButtonText="Create Project Type"
            />
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default CreateProjectType;