// components/users/UserForm.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Divider,
  Switch,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  Save as SaveIcon,
  Work as WorkIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { userService, companyService } from '../../services/api';

const UserForm = ({ 
  initialData = {}, 
  onSubmit, 
  isLoading = false, 
  error = null, 
  isEditMode = false,
  companies = []
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    designation: initialData.designation || '',
    company_id: initialData.company_id || '',
    role: initialData.role || 'contributor',
    is_active: initialData.is_active !== undefined ? initialData.is_active : true
  });
  
  const [errors, setErrors] = useState({});
  const [availableCompanies, setAvailableCompanies] = useState(companies);
  const [loadingCompanies, setLoadingCompanies] = useState(companies.length === 0);
  
  useEffect(() => {
    // If companies aren't provided, fetch them
    const fetchCompanies = async () => {
      if (companies.length === 0) {
        try {
          // In a real app, this would call your API
          // const response = await companyService.getCompanies();
          // setAvailableCompanies(response.companies);
          
          // Simulated data
          setTimeout(() => {
            const mockCompanies = [
              { id: 1, name: 'Acme Corporation' },
              { id: 2, name: 'TechGlobal Inc.' },
              { id: 3, name: 'FinTrust Services' }
            ];
            
            setAvailableCompanies(mockCompanies);
            setLoadingCompanies(false);
          }, 1000);
        } catch (error) {
          console.error('Error fetching companies:', error);
          setLoadingCompanies(false);
        }
      }
    };
    
    fetchCompanies();
  }, [companies]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    // Super admins don't need a company, others do
    if (formData.role !== 'super_admin' && !formData.company_id) {
      newErrors.company_id = 'Company is required for this role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Prepare data for submission (omit company_id for super_admin)
      const submissionData = { ...formData };
      if (formData.role === 'super_admin') {
        delete submissionData.company_id;
      }
      
      onSubmit(submissionData);
    }
  };
  
  // Get role descriptions
  const getRoleDescription = (role) => {
    const descriptions = {
      'super_admin': 'Full access to all features and companies. Can manage system settings and other admins.',
      'client_admin': 'Can manage users and projects within their company. Primary contact for the company.',
      'project_owner': 'Manages specific projects and can assign tasks to contributors.',
      'auditor': 'Reviews and approves evidence items and compliance documentation.',
      'contributor': 'Submits evidence and performs tasks assigned by project owners.'
    };
    
    return descriptions[role] || '';
  };
  
  // Check if the form is for a super admin
  const isSuperAdminForm = formData.role === 'super_admin';
  
  return (
    <Paper 
      elevation={0} 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ 
        p: 3,
        borderRadius: 2,
        border: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Typography variant="h6" sx={{ mb: 3 }}>
        {isEditMode ? 'Edit User' : 'Create New User'}
      </Typography>
      
      <Grid container spacing={3}>
        {/* User Details Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            User Details
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
                label="Designation / Job Title"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                error={!!errors.designation}
                helperText={errors.designation}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            {/* Role & Company Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Role & Organization
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.role}>
                <InputLabel id="role-label">User Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  label="User Role"
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <WorkIcon color="action" />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <Tooltip title={getRoleDescription(formData.role)}>
                        <IconButton edge="end" size="small">
                          <HelpIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  }
                >
                  <MenuItem value="super_admin">Super Admin</MenuItem>
                  <MenuItem value="client_admin">Client Admin</MenuItem>
                  <MenuItem value="project_owner">Project Owner</MenuItem>
                  <MenuItem value="auditor">Auditor</MenuItem>
                  <MenuItem value="contributor">Contributor</MenuItem>
                </Select>
                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
              </FormControl>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1, ml: 1 }}>
                {getRoleDescription(formData.role)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                required={!isSuperAdminForm} 
                disabled={isSuperAdminForm || loadingCompanies}
                error={!!errors.company_id}
              >
                <InputLabel id="company-label">Company</InputLabel>
                <Select
                  labelId="company-label"
                  id="company_id"
                  name="company_id"
                  value={isSuperAdminForm ? '' : formData.company_id}
                  label="Company"
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <BusinessIcon color="action" />
                    </InputAdornment>
                  }
                >
                  {isSuperAdminForm && (
                    <MenuItem value="">
                      <em>Not Applicable (System User)</em>
                    </MenuItem>
                  )}
                  
                  {loadingCompanies ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} /> Loading companies...
                    </MenuItem>
                  ) : (
                    availableCompanies.map((company) => (
                      <MenuItem key={company.id} value={company.id}>
                        {company.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.company_id && <FormHelperText>{errors.company_id}</FormHelperText>}
                {isSuperAdminForm && (
                  <FormHelperText>
                    Super Admins are system-wide users and are not associated with any company
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            {/* Status Section */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleSwitchChange}
                    name="is_active"
                    color="primary"
                  />
                }
                label="Active"
              />
              <FormHelperText>
                {formData.is_active 
                  ? 'User is active and can log in to the system' 
                  : 'User is inactive and cannot log in to the system'}
              </FormHelperText>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="caption" color="textSecondary">
                {isEditMode 
                  ? 'Note: When you update this user, they will receive an email notification about the changes.'
                  : 'Note: Once created, the user will receive an email with instructions to set up their account.'}
              </Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={isLoading}
            >
              {isEditMode ? 'Update User' : 'Create User'}
            </Button>
          </Box>
        </Paper>
      );
    };
    
    export default UserForm;