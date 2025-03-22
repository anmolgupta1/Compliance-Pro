// pages/users/UserList.js
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
  FormControl,
  InputLabel,
  Select,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const UserList = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [companies, setCompanies] = useState([]);
  
  // Menu state for each user row
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // In a real app, this would fetch from your API
        // const response = await userService.getUsers();
        // setUsers(response.users);
        
        // Simulated data
        setTimeout(() => {
          const mockUsers = [
            {
              id: 1,
              name: 'John Smith',
              email: 'john.smith@acmecorp.com',
              phone: '(555) 123-4567',
              designation: 'IT Director',
              company: {
                id: 1,
                name: 'Acme Corporation'
              },
              role: 'client_admin',
              status: 'active',
              created_at: '2025-01-15T10:30:00'
            },
            {
              id: 2,
              name: 'Sarah Johnson',
              email: 'sarah.johnson@acmecorp.com',
              phone: '(555) 234-5678',
              designation: 'Compliance Manager',
              company: {
                id: 1,
                name: 'Acme Corporation'
              },
              role: 'project_owner',
              status: 'active',
              created_at: '2025-01-20T11:45:00'
            },
            {
              id: 3,
              name: 'Michael Brown',
              email: 'michael.brown@techglobal.com',
              phone: '(555) 345-6789',
              designation: 'Security Analyst',
              company: {
                id: 2,
                name: 'TechGlobal Inc.'
              },
              role: 'contributor',
              status: 'active',
              created_at: '2025-01-25T14:15:00'
            },
            {
              id: 4,
              name: 'Emily Davis',
              email: 'emily.davis@compliancepro.com',
              phone: '(555) 456-7890',
              designation: 'Security Auditor',
              company: null,
              role: 'super_admin',
              status: 'active',
              created_at: '2025-01-10T09:00:00'
            },
            {
              id: 5,
              name: 'Robert Wilson',
              email: 'robert.wilson@acmecorp.com',
              phone: '(555) 567-8901',
              designation: 'IT Specialist',
              company: {
                id: 1,
                name: 'Acme Corporation'
              },
              role: 'contributor',
              status: 'inactive',
              created_at: '2025-02-01T16:30:00'
            }
          ];
          
          const mockCompanies = [
            { id: 1, name: 'Acme Corporation' },
            { id: 2, name: 'TechGlobal Inc.' },
            { id: 3, name: 'FinTrust Services' }
          ];
          
          setUsers(mockUsers);
          setFilteredUsers(mockUsers);
          setCompanies(mockCompanies);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  useEffect(() => {
    // Apply filters and search
    let result = [...users];
    
    // Search filter
    if (searchTerm.trim() !== '') {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    // Company filter
    if (companyFilter !== 'all') {
      result = result.filter(user => 
        user.company && user.company.id === parseInt(companyFilter)
      );
    }
    
    setFilteredUsers(result);
    setPage(0); // Reset to first page when filters change
  }, [searchTerm, roleFilter, statusFilter, companyFilter, users]);
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
  };
  
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };
  
  const handleCompanyFilterChange = (event) => {
    setCompanyFilter(event.target.value);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };
  
  const handleViewUser = () => {
    navigate(`/users/${selectedUser.id}`);
    handleMenuClose();
  };
  
  const handleEditUser = () => {
    navigate(`/users/${selectedUser.id}/edit`);
    handleMenuClose();
  };
  
  const handleToggleUserStatus = () => {
    // In a real app, this would call your API
    // await userService.toggleUserStatus(selectedUser.id);
    
    // Update local state
    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          status: user.status === 'active' ? 'inactive' : 'active'
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    handleMenuClose();
  };
  
  const handleDeleteUser = () => {
    // In a real app, this would call your API
    // await userService.deleteUser(selectedUser.id);
    
    // Update local state
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setFilteredUsers(filteredUsers.filter(user => user.id !== selectedUser.id));
    
    handleMenuClose();
  };
  
  const handleCreateUser = () => {
    navigate('/users/new');
  };
  
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
  
  const getRoleColor = (role) => {
    const roleColorMap = {
      'super_admin': 'error',
      'client_admin': 'secondary',
      'project_owner': 'primary',
      'auditor': 'info',
      'contributor': 'success'
    };
    
    return roleColorMap[role] || 'default';
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Calculate pagination
  const emptyRows = page > 0 
    ? Math.max(0, (1 + page) * rowsPerPage - filteredUsers.length) 
    : 0;
    
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Users
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateUser}
          >
            Add User
          </Button>
        </Box>
        
        {/* Search and filter bar */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 3, 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            gap: 2,
            borderRadius: 2,
            border: theme => `1px solid ${theme.palette.divider}`,
          }}
        >
          <TextField
            placeholder="Search users..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ 
              flexGrow: 1,
              maxWidth: { xs: '100%', md: '40%' }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="role-filter-label">Role</InputLabel>
              <Select
                labelId="role-filter-label"
                id="role-filter"
                value={roleFilter}
                label="Role"
                onChange={handleRoleFilterChange}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="super_admin">Super Admin</MenuItem>
                <MenuItem value="client_admin">Client Admin</MenuItem>
                <MenuItem value="project_owner">Project Owner</MenuItem>
                <MenuItem value="auditor">Auditor</MenuItem>
                <MenuItem value="contributor">Contributor</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="company-filter-label">Company</InputLabel>
              <Select
                labelId="company-filter-label"
                id="company-filter"
                value={companyFilter}
                label="Company"
                onChange={handleCompanyFilterChange}
              >
                <MenuItem value="all">All Companies</MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id.toString()}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>
        
        {/* User list */}
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
            <Table sx={{ minWidth: 750 }} aria-label="users table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Designation</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  // Skeleton loading state
                  Array.from(new Array(5)).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell><Skeleton variant="text" sx={{ width: '60%' }} /></TableCell>
                      <TableCell><Skeleton variant="text" sx={{ width: '40%' }} /></TableCell>
                      <TableCell><Skeleton variant="text" sx={{ width: '50%' }} /></TableCell>
                      <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                      <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                      <TableCell><Skeleton variant="text" sx={{ width: '40%' }} /></TableCell>
                      <TableCell align="right"><Skeleton variant="circular" width={32} height={32} /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <>
                    {paginatedUsers.map((user) => (
                      <TableRow
                        hover
                        key={user.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Tooltip title={user.role === 'super_admin' ? 'Super Admin' : 'User'}>
                                <PersonIcon 
                                  sx={{ 
                                    mr: 1, 
                                    color: user.role === 'super_admin' ? 'error.main' : 'action'
                                  }} 
                                  fontSize="small" 
                                />
                              </Tooltip>
                              <Typography variant="body2" fontWeight="medium">
                                {user.name}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="textSecondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {user.company ? (
                            user.company.name
                          ) : (
                            <Typography variant="caption" color="textSecondary">
                              System User
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{user.designation || '-'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={getRoleLabel(user.role)} 
                            size="small"
                            color={getRoleColor(user.role)}
                            sx={{
                              fontWeight: 500,
                              borderRadius: 1,
                              textTransform: 'capitalize'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.status} 
                            size="small"
                            sx={{
                              bgcolor: user.status === 'active' ? 'success.lighter' : 'error.lighter',
                              color: user.status === 'active' ? 'success.main' : 'error.main',
                              fontWeight: 500,
                              borderRadius: 1,
                              textTransform: 'capitalize'
                            }}
                          />
                        </TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            aria-label="more"
                            id={`user-menu-button-${user.id}`}
                            aria-controls={`user-menu-${user.id}`}
                            aria-haspopup="true"
                            onClick={(e) => handleMenuOpen(e, user)}
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
                
                {!loading && filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="body1">No users found</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Try different search terms or filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={filteredUsers.length}
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
            Showing {filteredUsers.length > 0 ? (page * rowsPerPage) + 1 : 0} to {Math.min((page + 1) * rowsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' || companyFilter !== 'all' ? ' (filtered)' : ''}
          </Typography>
        </Box>
        
        {/* User action menu */}
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          keepMounted
        >
          <MenuItem onClick={handleViewUser}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleEditUser}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit User</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleToggleUserStatus}>
            <ListItemIcon>
              {selectedUser?.status === 'active' ? (
                <BlockIcon fontSize="small" color="error" />
              ) : (
                <CheckCircleIcon fontSize="small" color="success" />
              )}
            </ListItemIcon>
            <ListItemText>
              {selectedUser?.status === 'active' ? 'Deactivate' : 'Activate'} User
            </ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete User</ListItemText>
          </MenuItem>
        </Menu>
      </Container>
    </DashboardLayout>
  );
};

export default UserList;