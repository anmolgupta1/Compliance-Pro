// pages/standards/StandardsList.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Skeleton,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FileCopy as FileCopyIcon,
  LibraryBooks as LibraryBooksIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const StandardsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [standards, setStandards] = useState([]);
  const [filteredStandards, setFilteredStandards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStandard, setSelectedStandard] = useState(null);
  
  useEffect(() => {
    const fetchStandards = async () => {
      try {
        // In a real app, this would call your API
        // const response = await standardsService.getStandards();
        // setStandards(response.standards);
        
        // Simulated data
        setTimeout(() => {
          const mockStandards = [
            {
              id: 1,
              name: 'Payment Card Industry Data Security Standard',
              code: 'PCI-DSS',
              version: '4.0',
              description: 'Standard for organizations that handle credit cards',
              requirements_count: 78,
              created_at: '2025-01-10T08:30:00'
            },
            {
              id: 2,
              name: 'Health Insurance Portability and Accountability Act',
              code: 'HIPAA',
              version: '2022',
              description: 'US legislation for data privacy and security for medical information',
              requirements_count: 42,
              created_at: '2025-01-15T10:15:00'
            },
            {
              id: 3,
              name: 'General Data Protection Regulation',
              code: 'GDPR',
              version: '2018',
              description: 'Regulation on data protection and privacy in the EU',
              requirements_count: 53,
              created_at: '2025-01-20T14:45:00'
            },
            {
              id: 4,
              name: 'ISO Information Security Standard',
              code: 'ISO27001',
              version: '2022',
              description: 'International standard for information security',
              requirements_count: 114,
              created_at: '2025-01-25T09:00:00'
            },
            {
              id: 5,
              name: 'System and Organization Controls',
              code: 'SOC2',
              version: '2017',
              description: 'Controls for service organizations',
              requirements_count: 61,
              created_at: '2025-02-01T11:30:00'
            }
          ];
          
          setStandards(mockStandards);
          setFilteredStandards(mockStandards);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching standards:', error);
        setLoading(false);
      }
    };
    
    fetchStandards();
  }, []);
  
  useEffect(() => {
    // Filter standards when search term changes
    if (searchTerm.trim() === '') {
      setFilteredStandards(standards);
    } else {
      const filtered = standards.filter(standard => 
        standard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        standard.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        standard.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStandards(filtered);
    }
  }, [searchTerm, standards]);
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleMenuOpen = (event, standard) => {
    setAnchorEl(event.currentTarget);
    setSelectedStandard(standard);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStandard(null);
  };
  
  const handleViewStandard = () => {
    navigate(`/standards/${selectedStandard.id}`);
    handleMenuClose();
  };
  
  const handleEditStandard = () => {
    navigate(`/standards/${selectedStandard.id}/edit`);
    handleMenuClose();
  };
  
  const handleDuplicateStandard = () => {
    navigate(`/standards/duplicate/${selectedStandard.id}`);
    handleMenuClose();
  };
  
  const handleViewRequirements = () => {
    navigate(`/standards/${selectedStandard.id}/requirements`);
    handleMenuClose();
  };
  
  const handleDeleteStandard = () => {
    // In a real app, this would call your API
    // await standardsService.deleteStandard(selectedStandard.id);
    
    // Update local state
    setStandards(standards.filter(standard => standard.id !== selectedStandard.id));
    setFilteredStandards(filteredStandards.filter(standard => standard.id !== selectedStandard.id));
    
    handleMenuClose();
  };
  
  const handleCreateStandard = () => {
    navigate('/standards/new');
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Calculate pagination
  const emptyRows = page > 0 
    ? Math.max(0, (1 + page) * rowsPerPage - filteredStandards.length) 
    : 0;
    
  const paginatedStandards = filteredStandards.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Compliance Standards
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateStandard}
          >
            Add Standard
          </Button>
        </Box>
        
        {/* Search bar */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 3, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 2,
            border: theme => `1px solid ${theme.palette.divider}`,
          }}
        >
          <TextField
            placeholder="Search standards..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ width: { xs: '100%', sm: '50%', md: '35%' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Paper>
        
        {/* Standards list */}
        <Paper 
          elevation={0} 
          sx={{ 
            width: '100%', 
            mb: 2, 
            borderRadius: 2,
            overflow: 'hidden',
            border: theme => `1px solid ${theme.palette.divider}`,
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-label="standards table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Standard Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Version</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Requirements</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  // Skeleton loading state
                  Array.from(new Array(5)).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell><Skeleton variant="text" sx={{ width: '90%' }} /></TableCell>
                      <TableCell><Skeleton variant="text" sx={{ width: '40%' }} /></TableCell>
                      <TableCell><Skeleton variant="text" sx={{ width: '30%' }} /></TableCell>
                      <TableCell><Skeleton variant="text" sx={{ width: '40%' }} /></TableCell>
                      <TableCell><Skeleton variant="text" sx={{ width: '60%' }} /></TableCell>
                      <TableCell align="right"><Skeleton variant="circular" width={32} height={32} /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <>
                    {paginatedStandards.map((standard) => (
                      <TableRow
                        hover
                        key={standard.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2" fontWeight="medium">
                              {standard.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {standard.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={standard.code} 
                            size="small"
                            color="primary"
                            sx={{
                              fontWeight: 500,
                              borderRadius: 1
                            }}
                          />
                        </TableCell>
                        <TableCell>{standard.version}</TableCell>
                        <TableCell>{standard.requirements_count}</TableCell>
                        <TableCell>{formatDate(standard.created_at)}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            aria-label="more"
                            id={`standard-menu-button-${standard.id}`}
                            aria-controls={`standard-menu-${standard.id}`}
                            aria-haspopup="true"
                            onClick={(e) => handleMenuOpen(e, standard)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </>
                )}
                
                {!loading && filteredStandards.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="body1">No standards found</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Try a different search term or create a new standard
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={filteredStandards.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
        
        {/* Results summary */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="textSecondary">
            Showing {filteredStandards.length > 0 ? (page * rowsPerPage) + 1 : 0} to {Math.min((page + 1) * rowsPerPage, filteredStandards.length)} of {filteredStandards.length} standards
            {searchTerm ? ' (filtered)' : ''}
          </Typography>
        </Box>
        
        {/* Standard action menu */}
        <Menu
          id="standard-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          keepMounted
        >
          <MenuItem onClick={handleViewStandard}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleViewRequirements}>
            <ListItemIcon>
              <LibraryBooksIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Requirements</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleEditStandard}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDuplicateStandard}>
            <ListItemIcon>
              <FileCopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Duplicate</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleDeleteStandard} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Container>
    </DashboardLayout>
  );
};

export default StandardsList;