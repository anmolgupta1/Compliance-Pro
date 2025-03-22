import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Chip, 
  Menu, 
  MenuItem, 
  Grid, 
  TextField, 
  InputAdornment, 
  FormControl,
  InputLabel,
  Select,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as DuplicateIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

// Mock data for project types - replace with API call later
const mockProjectTypes = [
  {
    id: 1,
    name: 'SOC 2 Type 1',
    description: 'Point-in-time assessment of security controls',
    category: 'GRC',
    isAuditable: true,
    associatedStandards: ['SOC 2'],
    createdAt: '2023-10-15T00:00:00Z',
    status: 'active'
  },
  {
    id: 2,
    name: 'PCI DSS Gap Assessment',
    description: 'Identifies gaps between current state and PCI DSS requirements',
    category: 'GRC',
    isAuditable: false,
    associatedStandards: ['PCI DSS'],
    createdAt: '2023-10-16T00:00:00Z',
    status: 'active'
  },
  {
    id: 3,
    name: 'External Penetration Test',
    description: 'Tests external perimeter security',
    category: 'Testing',
    isAuditable: true,
    associatedStandards: ['PCI DSS', 'NIST'],
    createdAt: '2023-10-17T00:00:00Z',
    status: 'active'
  },
  {
    id: 4,
    name: 'HIPAA Compliance Review',
    description: 'Assessment of HIPAA security and privacy requirements',
    category: 'GRC',
    isAuditable: true,
    associatedStandards: ['HIPAA'],
    createdAt: '2023-10-18T00:00:00Z',
    status: 'active'
  },
  {
    id: 5,
    name: 'Internal Vulnerability Scan',
    description: 'Scan for vulnerabilities on internal network',
    category: 'Testing',
    isAuditable: false,
    associatedStandards: ['PCI DSS', 'NIST', 'SOC 2'],
    createdAt: '2023-10-19T00:00:00Z',
    status: 'active'
  },
  {
    id: 6,
    name: 'GDPR Readiness Assessment',
    description: 'Evaluation of preparedness for GDPR compliance',
    category: 'GRC',
    isAuditable: false,
    associatedStandards: ['GDPR'],
    createdAt: '2023-10-20T00:00:00Z',
    status: 'active'
  },
];

const ProjectTypesList = () => {
  const navigate = useNavigate();
  
  // State variables
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [projectTypes, setProjectTypes] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProjectType, setSelectedProjectType] = useState(null);

  // Load data
  useEffect(() => {
    // In a real app, this would be an API call
    setProjectTypes(mockProjectTypes);
  }, []);

  // Filter project types based on search query and category filter
  const filteredProjectTypes = projectTypes.filter(projectType => {
    const matchesSearch = projectType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projectType.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || projectType.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Handle menu open
  const handleMenuOpen = (event, projectType) => {
    setAnchorEl(event.currentTarget);
    setSelectedProjectType(projectType);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle view project type details
  const handleViewProjectType = () => {
    navigate(`/project-types/${selectedProjectType.id}`);
    handleMenuClose();
  };

  // Handle edit project type
  const handleEditProjectType = () => {
    navigate(`/project-types/${selectedProjectType.id}/edit`);
    handleMenuClose();
  };

  // Handle duplicate project type
  const handleDuplicateProjectType = () => {
    // In a real app, this would make an API call
    console.log(`Duplicate project type: ${selectedProjectType.id}`);
    handleMenuClose();
  };

  // Handle delete project type
  const handleDeleteProjectType = () => {
    // In a real app, this would show a confirmation dialog and make an API call
    console.log(`Delete project type: ${selectedProjectType.id}`);
    handleMenuClose();
  };

  // Render grid view
  const renderGridView = () => {
    return (
      <Grid container spacing={3}>
        {filteredProjectTypes.map((projectType) => (
          <Grid item xs={12} sm={6} md={4} key={projectType.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px -10px rgba(0,0,0,0.2)'
                }
              }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
                    {projectType.name}
                  </Typography>
                  <Chip 
                    label={projectType.category} 
                    size="small" 
                    sx={{ 
                      mr: 1, 
                      backgroundColor: projectType.category === 'GRC' ? '#76ABAE' : '#31363F',
                      color: '#EEEEEE'
                    }} 
                  />
                  <Chip 
                    label={projectType.isAuditable ? 'Auditable' : 'Non-Auditable'} 
                    size="small" 
                    sx={{
                      backgroundColor: projectType.isAuditable ? '#4caf50' : '#ff9800',
                      color: '#EEEEEE'
                    }}
                  />
                </Box>
                <IconButton 
                  size="small" 
                  aria-label="options" 
                  onClick={(e) => handleMenuOpen(e, projectType)}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <CardContent sx={{ pt: 0, flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {projectType.description}
                </Typography>
                <Box sx={{ mt: 'auto' }}>
                  <Typography variant="caption" component="div" sx={{ mb: 0.5 }}>
                    Associated Standards:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {projectType.associatedStandards.map((standard, index) => (
                      <Chip key={index} label={standard} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Render table view
  const renderTableView = () => {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="project types table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Auditable</TableCell>
              <TableCell>Associated Standards</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjectTypes.map((projectType) => (
              <TableRow key={projectType.id}>
                <TableCell component="th" scope="row">
                  {projectType.name}
                </TableCell>
                <TableCell>{projectType.description}</TableCell>
                <TableCell>
                  <Chip 
                    label={projectType.category} 
                    size="small" 
                    sx={{ 
                      backgroundColor: projectType.category === 'GRC' ? '#76ABAE' : '#31363F',
                      color: '#EEEEEE'
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={projectType.isAuditable ? 'Yes' : 'No'} 
                    size="small" 
                    sx={{
                      backgroundColor: projectType.isAuditable ? '#4caf50' : '#ff9800',
                      color: '#EEEEEE'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {projectType.associatedStandards.map((standard, index) => (
                      <Chip key={index} label={standard} size="small" variant="outlined" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    aria-label="options" 
                    onClick={(e) => handleMenuOpen(e, projectType)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Project Types
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/project-types/new')}
            sx={{ backgroundColor: '#76ABAE' }}
          >
            Create Project Type
          </Button>
        </Box>

        {/* Filters and search */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search project types..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 240, flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              id="category-filter"
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="GRC">GRC</MenuItem>
              <MenuItem value="Testing">Testing</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Table View">
            <IconButton 
              color={viewMode === 'table' ? 'primary' : 'default'}
              onClick={() => setViewMode('table')}
            >
              <ViewListIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Grid View">
            <IconButton 
              color={viewMode === 'grid' ? 'primary' : 'default'}
              onClick={() => setViewMode('grid')}
            >
              <ViewModuleIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Project types list */}
        <Box sx={{ mt: 2 }}>
          {viewMode === 'table' ? renderTableView() : renderGridView()}
        </Box>

        {/* Action menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleViewProjectType}>
            <ViewIcon fontSize="small" sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          <MenuItem onClick={handleEditProjectType}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDuplicateProjectType}>
            <DuplicateIcon fontSize="small" sx={{ mr: 1 }} />
            Duplicate
          </MenuItem>
          <MenuItem onClick={handleDeleteProjectType} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </Box>
    </DashboardLayout>
  );
};

export default ProjectTypesList;