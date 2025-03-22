// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Company pages
import CompanyList from './pages/companies/CompanyList';
import CompanyDetail from './pages/companies/CompanyDetail';
import CreateCompany from './pages/companies/CreateCompany';
import EditCompany from './pages/companies/EditCompany';

// User pages
import UserList from './pages/users/UserList';
import UserDetail from './pages/users/UserDetail';
import CreateUser from './pages/users/CreateUser';
import EditUser from './pages/users/EditUser';

// Standards pages
import StandardsList from './pages/standards/StandardsList';
import StandardDetail from './pages/standards/StandardDetail';
import CreateStandard from './pages/standards/CreateStandard';
import EditStandard from './pages/standards/EditStandard';
import RequirementsList from './pages/standards/RequirementsList';

// Project Types pages
import ProjectTypesList from './pages/project-types/ProjectTypesList';
import ProjectTypeDetail from './pages/project-types/ProjectTypeDetail';
import CreateProjectType from './pages/project-types/CreateProjectType';
import EditProjectType from './pages/project-types/EditProjectType';

// Create theme with Compliance Pro colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#76ABAE',
      dark: '#5f8a8c',
      light: '#9bc3c5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#31363F',
      dark: '#222831',
      light: '#4a4f57',
      contrastText: '#ffffff',
    },
    background: {
      default: '#EEEEEE',
      paper: '#ffffff',
    },
    text: {
      primary: '#222831',
      secondary: '#31363F',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes - require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* User Routes (general access) */}
              <Route path="/users/:id" element={<UserDetail />} />
              <Route path="/users/:id/edit" element={<EditUser />} />
            </Route>
            
            {/* Admin routes - require specific roles */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'client_admin']} />}>
              {/* User admin routes */}
              <Route path="/users" element={<UserList />} />
              <Route path="/users/new" element={<CreateUser />} />
            </Route>
            
            {/* Super admin only routes */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
              {/* Company Routes */}
              <Route path="/companies" element={<CompanyList />} />
              <Route path="/companies/:id" element={<CompanyDetail />} />
              <Route path="/companies/new" element={<CreateCompany />} />
              <Route path="/companies/:id/edit" element={<EditCompany />} />
              
              {/* Standards Routes */}
              <Route path="/standards" element={<StandardsList />} />
              <Route path="/standards/new" element={<CreateStandard />} />
              <Route path="/standards/:id" element={<StandardDetail />} />
              <Route path="/standards/:id/edit" element={<EditStandard />} />
              <Route path="/standards/:id/requirements" element={<RequirementsList />} />
              <Route path="/standards/duplicate/:id" element={<CreateStandard />} />
              
              {/* Project Types Routes */}
              <Route path="/project-types" element={<ProjectTypesList />} />
              <Route path="/project-types/new" element={<CreateProjectType />} />
              <Route path="/project-types/:id" element={<ProjectTypeDetail />} />
              <Route path="/project-types/:id/edit" element={<EditProjectType />} />
            </Route>
            
            {/* Default route - redirect to login or dashboard based on auth status */}
            <Route 
              path="*" 
              element={<Navigate to="/login" replace />} 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;