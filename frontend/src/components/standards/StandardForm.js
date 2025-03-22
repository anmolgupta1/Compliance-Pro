// components/standards/StandardForm.js
import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Divider,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Description as DescriptionIcon,
  Code as CodeIcon,
  Tag as TagIcon,
  Notes as NotesIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const StandardForm = ({ 
  initialData = {}, 
  onSubmit, 
  isLoading = false, 
  error = null, 
  isEditMode = false 
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    code: initialData.code || '',
    version: initialData.version || '',
    description: initialData.description || ''
  });
  
  const [errors, setErrors] = useState({});
  
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
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Standard name is required';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Standard code is required';
    } else if (!/^[A-Za-z0-9-]+$/.test(formData.code.trim())) {
      newErrors.code = 'Code can only contain letters, numbers, and hyphens';
    }
    
    if (!formData.version.trim()) {
      newErrors.version = 'Version is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
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
        {isEditMode ? 'Edit Compliance Standard' : 'Create New Compliance Standard'}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Standard Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Standard Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            error={!!errors.code}
            helperText={errors.code || 'E.g., PCI-DSS, HIPAA, GDPR'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CodeIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Version"
            name="version"
            value={formData.version}
            onChange={handleChange}
            error={!!errors.version}
            helperText={errors.version || 'E.g., 4.0, 2022, etc.'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TagIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={4}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <NotesIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
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
          {isEditMode ? 'Update Standard' : 'Create Standard'}
        </Button>
      </Box>
    </Paper>
  );
};

export default StandardForm;