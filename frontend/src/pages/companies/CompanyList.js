// pages/companies/CompanyList.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Divider,
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
  Grid,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Folder as FolderIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { companyService } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';

const CompanyList = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  
  // Menu state for each company row
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // In a real app, this would fetch from your API
        // const response = await companyService.getCompanies();
        // setCompanies(response.companies);
        
        // Simulated data
        setTimeout(() => {
          const mockCompanies = [
            {
              id: 1,
              name: 'Acme Corporation',
              logo_path: null,
              address: '123 Main Street, Metropolis',
              created_at: '2025-01-10T08:30:00',
              is_active: true,
              stats: {
                users: 8,
                projects: 5
              }
            },
            {
              id: 2,
              name: 'TechGlobal Inc.',
              logo_path: null,
              address: '456 Tech Blvd, Silicon Valley',
              created_at: '2025-01-15T10:15:00',
              is_active: true,
              stats: {
                users: 12,
                projects: 7
              }
            },
            {
              id: 3,
              name: 'FinTrust Services',
              logo_path: null,
              address: '789 Finance Ave, New York',
              created_at: '2025-01-20T14:45:00',
              is_active: true,
              stats: {
                users: 6,
                projects: 3
              }
            },
            {
              id: 4,
              name: 'HealthCare Plus',
              logo_path: null,
              address: '321 Hospital Road, Boston',
              created_at: '2025-01-25T09:00:00',
              is_active: false,
              stats: {
                users: 4,
                projects: 2
              }
            },
            {
              id: 5,
              name: 'Retail Unlimited',
              logo_path: null,
              address: '555 Shopping Lane, Chicago',
              created_at: '2025-02-01T11:30:00',
              is_active: true,
              stats: {
                users: 9,
                projects: 4
              }
            }
          ];
          
          setCompanies(mockCompanies);
          setFilteredCompanies(mockCompanies);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setLoading(false);
      }
    };
    
    fetchCompanies();
  }, []);
  
  useEffect(() => {
    // Filter companies when search term changes
    if (searchTerm.trim() === '') {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchTerm, companies]);
  
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
  
  const handleMenuOpen = (event, company) => {
    setAnchorEl(event.currentTarget);
    setSelectedCompany(company);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCompany(null);
  };
  
  const handleViewCompany = () => {
    navigate(`/companies/${selectedCompany.id}`);
    handleMenuClose();
  };
  
  const handleEditCompany = () => {
    navigate(`/companies/${selectedCompany.id}/edit`);
    handleMenuClose();
  };
  
  const handleDeleteCompany = () => {
    // In a real app, you would call your API
    // await companyService.deleteCompany(selectedCompany.id);
    
    // Then update the UI
    setCompanies(companies.filter(company => company.id !== selectedCompany.id));
    setFilteredCompanies(filteredCompanies.filter(company => company.id !== selectedCompany.id));
    
    handleMenuClose();
  };
  
  const handleCreateCompany = () => {
    navigate('/companies/new');
  };
  
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Calculate pagination
  const emptyRows = page > 0 
    ? Math.max(0, (1 + page) * rowsPerPage - filteredCompanies.length) 
    : 0;
    
  const paginatedCompanies = filteredCompanies.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Table view component
  const renderTableView = () => (
    <Paper elevation={0} sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="companies table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Users</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Projects</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Skeleton loading state
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton variant="text" sx={{ width: '60%' }} /></TableCell>
                  <TableCell><Skeleton variant="text" sx={{ width: '80%' }} /></TableCell>
                  <TableCell><Skeleton variant="text" sx={{ width: '40%' }} /></TableCell>
                  <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                  <TableCell><Skeleton variant="text" sx={{ width: '30%' }} /></TableCell>
                  <TableCell><Skeleton variant="text" sx={{ width: '30%' }} /></TableCell>
                  <TableCell align="right"><Skeleton variant="circular" width={32} height={32} /></TableCell>
                </TableRow>
              ))
            ) : (
              <>
                {paginatedCompanies.map((company) => (
                  <TableRow
                    hover
                    key={company.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          variant="rounded" 
                          sx={{ 
                            bgcolor: 'primary.light', 
                            color: 'primary.main',
                            width: 32, 
                            height: 32,
                            mr: 1.5 
                          }}
                        >
                          {company.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" fontWeight="medium">
                          {company.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{company.address}</TableCell>
                    <TableCell>{formatDate(company.created_at)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={company.is_active ? 'Active' : 'Inactive'} 
                        size="small"
                        sx={{
                          bgcolor: company.is_active ? 'success.lighter' : 'error.lighter',
                          color: company.is_active ? 'success.main' : 'error.main',
                          fontWeight: 500,
                          borderRadius: 1
                        }}
                      />
                    </TableCell>
                    <TableCell>{company.stats.users}</TableCell>
                    <TableCell>{company.stats.projects}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="more"
                        id={`company-menu-button-${company.id}`}
                        aria-controls={`company-menu-${company.id}`}
                        aria-haspopup="true"
                        onClick={(e) => handleMenuOpen(e, company)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={7} />
                  </TableRow>
                )}
              </>
            )}
            
            {!loading && filteredCompanies.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body1">No companies found</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Try a different search term or create a new company
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        component="div"
        count={filteredCompanies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
  
  // Grid view component
  const renderGridView = () => (
    <Grid container spacing={3}>
      {loading ? (
        // Skeleton loading state
        Array.from(new Array(6)).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
            <Skeleton variant="rounded" height={200} />
          </Grid>
        ))
      ) : (
        paginatedCompanies.map((company) => (
          <Grid item xs={12} sm={6} md={4} key={company.id}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                borderRadius: 2,
                border: theme => `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      variant="rounded" 
                      sx={{ 
                        bgcolor: 'primary.light', 
                        color: 'primary.main',
                        width: 40, 
                        height: 40,
                        mr: 1.5 
                      }}
                    >
                      {company.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="medium">
                        {company.name}
                      </Typography>
                      <Chip 
                        label={company.is_active ? 'Active' : 'Inactive'} 
                        size="small"
                        sx={{
                          bgcolor: company.is_active ? 'success.lighter' : 'error.lighter',
                          color: company.is_active ? 'success.main' : 'error.main',
                          fontWeight: 500,
                          borderRadius: 1,
                          mt: 0.5
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <IconButton
                    aria-label="more"
                    id={`company-menu-button-${company.id}`}
                    aria-controls={`company-menu-${company.id}`}
                    aria-haspopup="true"
                    onClick={(e) => handleMenuOpen(e, company)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {company.address}
                </Typography>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PeopleIcon color="secondary" sx={{ mr: 1, fontSize: 20 }} />
                      <Box>
                        <Typography variant="h6" fontWeight="medium">
                          {company.stats.users}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Users
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FolderIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                      <Box>
                        <Typography variant="h6" fontWeight="medium">
                          {company.stats.projects}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Projects
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => {
                      navigate(`/companies/${company.id}`);
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
      
      {!loading && filteredCompanies.length === 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">No companies found</Typography>
            <Typography variant="body2" color="textSecondary">
              Try a different search term or create a new company
            </Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Companies
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateCompany}
          >
            Add Company
          </Button>
        </Box>
        
        {/* Search and filter bar */}
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
            placeholder="Search companies..."
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
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Table View">
              <Button 
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                color="secondary"
                onClick={() => handleViewModeChange('table')}
                size="small"
              >
                Table
              </Button>
            </Tooltip>
            <Tooltip title="Grid View">
              <Button 
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                color="secondary"
                onClick={() => handleViewModeChange('grid')}
                size="small"
              >
                Grid
              </Button>
            </Tooltip>
          </Box>
        </Paper>
        
        {/* Company list */}
        {viewMode === 'table' ? renderTableView() : renderGridView()}
        
        {/* Company action menu */}
        <Menu
          id="company-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          keepMounted
        >
          <MenuItem onClick={handleViewCompany}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleEditCompany}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleDeleteCompany} sx={{ color: 'error.main' }}>
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

export default CompanyList;