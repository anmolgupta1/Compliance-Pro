// pages/companies/CreateCompany.js
import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { companyService } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import CompanyForm from '../../components/companies/CompanyForm';

const steps = ['Company Details', 'Review'];

const CreateCompany = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [companyData, setCompanyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleCompanyFormSubmit = async (data) => {
    setCompanyData(data);
    setActiveStep(1); // Move to review step
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call your API
      // await companyService.createCompany(companyData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to company list on success
      navigate('/companies', { 
        state: { 
          notification: {
            type: 'success',
            message: 'Company created successfully!'
          }
        }
      });
    } catch (err) {
      console.error('Error creating company:', err);
      setError('Failed to create company. Please try again.');
      setActiveStep(0); // Go back to form on error
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackToList = () => {
    navigate('/companies');
  };
  
  // Render the review step
  const renderReview = () => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3,
        borderRadius: 2,
        border: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="h6" sx={{ mb: 3 }}>
        Review Company Details
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Company Name
        </Typography>
        <Typography variant="body1">
          {companyData.name}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Address
        </Typography>
        <Typography variant="body1">
          {companyData.address}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Email
        </Typography>
        <Typography variant="body1">
          {companyData.email || 'N/A'}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Phone
        </Typography>
        <Typography variant="body1">
          {companyData.phone || 'N/A'}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Status
        </Typography>
        <Typography variant="body1">
          {companyData.is_active ? 'Active' : 'Inactive'}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
        <Button
          onClick={handleBack}
          disabled={loading}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Company'}
        </Button>
      </Box>
    </Paper>
  );

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
            Back to Companies
          </Button>
        </Box>
        
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Create New Company
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Add a new company to the Compliance Pro system
          </Typography>
        </Box>
        
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Step content */}
        {activeStep === 0 ? (
          <CompanyForm 
            onSubmit={handleCompanyFormSubmit} 
            isLoading={loading}
            error={error}
          />
        ) : (
          renderReview()
        )}
      </Container>
    </DashboardLayout>
  );
};

export default CreateCompany;