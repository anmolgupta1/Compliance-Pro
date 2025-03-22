// pages/users/CreateUser.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { userService, companyService } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import UserForm from '../../components/users/UserForm';

const steps = ['User Details', 'Review'];

const CreateUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  
  // Pre-select company if coming from company details page
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const companyId = searchParams.get('company_id');
    const companyName = searchParams.get('company_name');
    
    if (companyId && companyName) {
      setCompanies([{ id: parseInt(companyId), name: companyName }]);
      setUserData(prev => ({
        ...prev,
        company_id: parseInt(companyId)
      }));
      setLoadingCompanies(false);
    } else {
      // Fetch companies if not pre-selected
      const fetchCompanies = async () => {
        try {
          // In a real app, this would call your API
          // const response = await companyService.getCompanies();
          // setCompanies(response.companies);
          
          // Simulated data
          setTimeout(() => {
            const mockCompanies = [
              { id: 1, name: 'Acme Corporation' },
              { id: 2, name: 'TechGlobal Inc.' },
              { id: 3, name: 'FinTrust Services' }
            ];
            
            setCompanies(mockCompanies);
            setLoadingCompanies(false);
          }, 1000);
        } catch (err) {
          console.error('Error fetching companies:', err);
          setLoadingCompanies(false);
        }
      };
      
      fetchCompanies();
    }
  }, [location]);
  
  const handleUserFormSubmit = (data) => {
    setUserData(data);
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
      // await userService.createUser(userData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect based on context
      if (userData.company_id) {
        // If created from company context, go back to company details
        navigate(`/companies/${userData.company_id}`, { 
          state: { 
            notification: {
              type: 'success',
              message: 'User created successfully!'
            }
          }
        });
      } else {
        // Otherwise go to user list
        navigate('/users', { 
          state: { 
            notification: {
              type: 'success',
              message: 'User created successfully!'
            }
          }
        });
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user. Please try again.');
      setActiveStep(0); // Go back to form on error
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackToList = () => {
    // Check if we came from a company page
    const searchParams = new URLSearchParams(location.search);
    const companyId = searchParams.get('company_id');
    
    if (companyId) {
      navigate(`/companies/${companyId}`);
    } else {
      navigate('/users');
    }
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
        Review User Details
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Full Name
        </Typography>
        <Typography variant="body1">
          {userData.name}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Email Address
        </Typography>
        <Typography variant="body1">
          {userData.email}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Phone Number
        </Typography>
        <Typography variant="body1">
          {userData.phone || 'N/A'}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Designation / Job Title
        </Typography>
        <Typography variant="body1">
          {userData.designation || 'N/A'}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary">
          User Role
        </Typography>
        <Typography variant="body1">
          {getRoleLabel(userData.role)}
        </Typography>
      </Box>
      
      {userData.role !== 'super_admin' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Company
          </Typography>
          <Typography variant="body1">
            {companies.find(c => c.id === userData.company_id)?.name || 'N/A'}
          </Typography>
        </Box>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Status
        </Typography>
        <Typography variant="body1">
          {userData.is_active ? 'Active' : 'Inactive'}
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
          {loading ? 'Creating...' : 'Create User'}
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
            Back to {location.search.includes('company_id') ? 'Company' : 'Users'}
          </Button>
        </Box>
        
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Create New User
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Add a new user to the Compliance Pro system
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
          <UserForm 
            onSubmit={handleUserFormSubmit}
            isLoading={loading}
            error={error}
            companies={companies}
          />
        ) : (
          renderReview()
        )}
      </Container>
    </DashboardLayout>
  );
};

export default CreateUser;