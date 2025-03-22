// pages/companies/EditCompany.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button,
  Skeleton,
  Alert
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { companyService } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import CompanyForm from '../../components/companies/CompanyForm';

const EditCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        // In a real app, this would call your API
        // const response = await companyService.getCompany(id);
        // setCompany(response.company);
        
        // Simulate API call
        setTimeout(() => {
          const mockCompany = {
            id: parseInt(id),
            name: 'Acme Corporation',
            address: '123 Main Street, Metropolis',
            email: 'info@acmecorp.com',
            phone: '(555) 123-4567',
            is_active: true
          };
          
          setCompany(mockCompany);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching company:', err);
        setError('Failed to load company data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchCompany();
  }, [id]);
  
  const handleUpdateCompany = async (data) => {
    setSubmitting(true);
    setFormError(null);
    
    try {
      // In a real app, this would call your API
      // await companyService.updateCompany(id, data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to company details on success
      navigate(`/companies/${id}`, { 
        state: { 
          notification: {
            type: 'success',
            message: 'Company updated successfully!'
          }
        }
      });
    } catch (err) {
      console.error('Error updating company:', err);
      setFormError('Failed to update company. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleBackToDetails = () => {
    navigate(`/companies/${id}`);
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
              onClick={() => navigate('/companies')}
            >
              Back to Companies
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
  
  // Render company not found
  if (!company) {
    return (
      <DashboardLayout>
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <Button
              variant="text"
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/companies')}
            >
              Back to Companies
            </Button>
          </Box>
          
          <Alert severity="warning" sx={{ mb: 3 }}>
            Company not found
          </Alert>
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
            onClick={handleBackToDetails}
          >
            Back to Company Details
          </Button>
        </Box>
        
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Edit Company
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Update details for {company.name}
          </Typography>
        </Box>
        
        {/* Company form */}
        <CompanyForm 
          initialData={company}
          onSubmit={handleUpdateCompany}
          isLoading={submitting}
          error={formError}
          isEditMode={true}
        />
      </Container>
    </DashboardLayout>
  );
};

export default EditCompany;