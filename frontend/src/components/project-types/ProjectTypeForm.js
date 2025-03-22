import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Switch,
  Divider,
  Autocomplete,
  Chip,
  IconButton,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Mock data for standards
const mockStandards = [
  { id: 1, name: 'SOC 2', version: '2017', description: 'Service Organization Control' },
  { id: 2, name: 'PCI DSS', version: '4.0', description: 'Payment Card Industry Data Security Standard' },
  { id: 3, name: 'HIPAA', version: '2013', description: 'Health Insurance Portability and Accountability Act' },
  { id: 4, name: 'GDPR', version: '2018', description: 'General Data Protection Regulation' },
  { id: 5, name: 'NIST', version: '800-53', description: 'National Institute of Standards and Technology' }
];

const ProjectTypeForm = ({ initialData, onSubmit, submitButtonText }) => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'GRC',
    isAuditable: true,
    status: 'active',
    associatedStandards: [],
    requiredEvidence: [],
    workflowSteps: []
  });
  
  // State for form validation
  const [errors, setErrors] = useState({});
  
  // State for new evidence and workflow items
  const [newEvidenceItem, setNewEvidenceItem] = useState({ name: '', description: '' });
  const [newWorkflowStep, setNewWorkflowStep] = useState({ name: '', description: '', order: 1 });
  
  // Initialize with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      
      // Set the next workflow step order
      if (initialData.workflowSteps && initialData.workflowSteps.length > 0) {
        setNewWorkflowStep(prev => ({
          ...prev,
          order: initialData.workflowSteps.length + 1
        }));
      }
    }
  }, [initialData]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle associated standards selection
  const handleStandardsChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      associatedStandards: newValue
    }));
  };
  
  // Handle adding evidence item
  const handleAddEvidence = () => {
    if (!newEvidenceItem.name) {
      setErrors(prev => ({ ...prev, newEvidenceName: 'Evidence name is required' }));
      return;
    }
    
    const newItem = { 
      id: Date.now(), // Temporary ID for UI purposes
      ...newEvidenceItem 
    };
    
    setFormData(prev => ({
      ...prev,
      requiredEvidence: [...prev.requiredEvidence, newItem]
    }));
    
    setNewEvidenceItem({ name: '', description: '' });
    setErrors(prev => ({ ...prev, newEvidenceName: '' }));
  };
  
  // Handle removing evidence item
  const handleRemoveEvidence = (id) => {
    setFormData(prev => ({
      ...prev,
      requiredEvidence: prev.requiredEvidence.filter(item => item.id !== id)
    }));
  };
  
  // Handle adding workflow step
  const handleAddWorkflowStep = () => {
    if (!newWorkflowStep.name) {
      setErrors(prev => ({ ...prev, newWorkflowName: 'Step name is required' }));
      return;
    }
    
    const newStep = { 
      id: Date.now(), // Temporary ID for UI purposes
      ...newWorkflowStep,
      order: formData.workflowSteps.length + 1
    };
    
    setFormData(prev => ({
      ...prev,
      workflowSteps: [...prev.workflowSteps, newStep]
    }));
    
    setNewWorkflowStep({ name: '', description: '', order: formData.workflowSteps.length + 2 });
    setErrors(prev => ({ ...prev, newWorkflowName: '' }));
  };
  
  // Handle removing workflow step
  const handleRemoveWorkflowStep = (id) => {
    const updatedSteps = formData.workflowSteps.filter(step => step.id !== id);
    
    // Reorder remaining steps
    const reorderedSteps = updatedSteps.map((step, index) => ({
      ...step,
      order: index + 1
    }));
    
    setFormData(prev => ({
      ...prev,
      workflowSteps: reorderedSteps
    }));
    
    // Update the new step order
    setNewWorkflowStep(prev => ({
      ...prev,
      order: reorderedSteps.length + 1
    }));
  };
  
  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = {};
    if (!formData.name) validationErrors.name = 'Name is required';
    if (!formData.description) validationErrors.description = 'Description is required';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Pass data to parent component
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleFormSubmit}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>
        
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={Boolean(errors.name)}
          helperText={errors.name}
          sx={{ mb: 2 }}
          required
        />
        
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={Boolean(errors.description)}
          helperText={errors.description}
          multiline
          rows={4}
          sx={{ mb: 2 }}
          required
        />
        
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Category</FormLabel>
          <RadioGroup
            row
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <FormControlLabel value="GRC" control={<Radio />} label="GRC" />
            <FormControlLabel value="Testing" control={<Radio />} label="Testing" />
          </RadioGroup>
        </FormControl>
        
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isAuditable}
                onChange={handleChange}
                name="isAuditable"
                color="primary"
              />
            }
            label="Auditable"
          />
        </Box>
        
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Status</FormLabel>
          <RadioGroup
            row
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <FormControlLabel value="active" control={<Radio />} label="Active" />
            <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
          </RadioGroup>
        </FormControl>
        
        <Autocomplete
          multiple
          id="associatedStandards"
          options={mockStandards}
          getOptionLabel={(option) => `${option.name} (${option.version})`}
          value={formData.associatedStandards}
          onChange={handleStandardsChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Associated Standards"
              placeholder="Select standards"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip 
                label={`${option.name} (${option.version})`} 
                {...getTagProps({ index })} 
              />
            ))
          }
          sx={{ mb: 2 }}
        />
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Required Evidence
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Evidence Name"
              value={newEvidenceItem.name}
              onChange={(e) => setNewEvidenceItem(prev => ({ ...prev, name: e.target.value }))}
              error={Boolean(errors.newEvidenceName)}
              helperText={errors.newEvidenceName}
              required
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Evidence Description"
              value={newEvidenceItem.description}
              onChange={(e) => setNewEvidenceItem(prev => ({ ...prev, description: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleAddEvidence}
              startIcon={<AddIcon />}
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>
        
        {formData.requiredEvidence.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Evidence Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell width="100">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.requiredEvidence.map((evidence) => (
                  <TableRow key={evidence.id}>
                    <TableCell>{evidence.name}</TableCell>
                    <TableCell>{evidence.description}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveEvidence(evidence.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No evidence items added yet
          </Typography>
        )}
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Workflow Steps
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Step Name"
              value={newWorkflowStep.name}
              onChange={(e) => setNewWorkflowStep(prev => ({ ...prev, name: e.target.value }))}
              error={Boolean(errors.newWorkflowName)}
              helperText={errors.newWorkflowName}
              required
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Step Description"
              value={newWorkflowStep.description}
              onChange={(e) => setNewWorkflowStep(prev => ({ ...prev, description: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleAddWorkflowStep}
              startIcon={<AddIcon />}
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>
        
        {formData.workflowSteps.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="80">Order</TableCell>
                  <TableCell>Step Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell width="100">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.workflowSteps
                  .sort((a, b) => a.order - b.order)
                  .map((step) => (
                  <TableRow key={step.id}>
                    <TableCell>{step.order}</TableCell>
                    <TableCell>{step.name}</TableCell>
                    <TableCell>{step.description}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveWorkflowStep(step.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No workflow steps added yet
          </Typography>
        )}
      </Box>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          size="large"
        >
          {submitButtonText || 'Submit'}
        </Button>
      </Box>
    </form>
  );
};

export default ProjectTypeForm;