// components/dashboard/DistributionCharts.js
import React, { useState } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  useTheme,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Stack,
  Divider
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data - in a real app, this would come from your API
const projectTypeData = [
  { name: 'GRC', value: 68 },
  { name: 'Testing', value: 32 }
];

const companyProjectsData = [
  { name: 'Acme Corp', grc: 4, testing: 2, total: 6 },
  { name: 'TechGlobal', grc: 6, testing: 3, total: 9 },
  { name: 'FinServe Inc', grc: 8, testing: 1, total: 9 },
  { name: 'Healthcare Plus', grc: 3, testing: 2, total: 5 },
  { name: 'RetailOne', grc: 2, testing: 3, total: 5 }
];

const complianceStatusData = [
  { name: 'Compliant', value: 42 },
  { name: 'In Progress', value: 35 },
  { name: 'Non-Compliant', value: 23 }
];

// RACI Distribution by user roles
const raciData = [
  { name: 'Responsible', client: 15, auditor: 7, owner: 65, contributor: 13 },
  { name: 'Accountable', client: 45, auditor: 8, owner: 40, contributor: 7 },
  { name: 'Consulted', client: 20, auditor: 60, owner: 15, contributor: 5 },
  { name: 'Informed', client: 25, auditor: 22, owner: 13, contributor: 40 }
];

const COLORS = ['#76ABAE', '#31363F', '#5f8a8c', '#4a4f57', '#9bc3c5'];
const STATUS_COLORS = ['#4caf50', '#ff9800', '#f44336']; // Green, Orange, Red

const ProjectTypeDistribution = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={projectTypeData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {projectTypeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value} Projects`, 'Count']} 
            contentStyle={{ 
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.divider
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

const CompanyProjectsChart = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ height: 300, mt: 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={companyProjectsData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.divider
            }}
          />
          <Legend />
          <Bar 
            dataKey="grc" 
            name="GRC Projects" 
            fill={theme.palette.primary.main} 
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            dataKey="testing" 
            name="Testing Projects" 
            fill={theme.palette.secondary.main} 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

const ComplianceStatusChart = () => {
  const theme = useTheme();
  const [standard, setStandard] = useState('all');
  
  const handleChange = (event) => {
    setStandard(event.target.value);
  };
  
  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Compliance Status</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="standard-select-label">Standard</InputLabel>
          <Select
            labelId="standard-select-label"
            id="standard-select"
            value={standard}
            label="Standard"
            onChange={handleChange}
          >
            <MenuItem value="all">All Standards</MenuItem>
            <MenuItem value="pci">PCI DSS</MenuItem>
            <MenuItem value="hipaa">HIPAA</MenuItem>
            <MenuItem value="gdpr">GDPR</MenuItem>
            <MenuItem value="iso">ISO 27001</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ height: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={complianceStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {complianceStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              // formatter={(value) => [`${value} Requirements`, name]} 
              formatter={(value, name) => [`${value} Requirements`, name]}
              contentStyle={{ 
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.divider
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      
      <Stack
        direction="row"
        spacing={2}
        divider={<Divider orientation="vertical" flexItem />}
        sx={{ mt: 2, justifyContent: 'center' }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: STATUS_COLORS[0],
            }}
          />
          <Box>
            <Typography variant="subtitle2">42%</Typography>
            <Typography variant="caption" color="textSecondary">Compliant</Typography>
          </Box>
        </Stack>
        
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: STATUS_COLORS[1],
            }}
          />
          <Box>
            <Typography variant="subtitle2">35%</Typography>
            <Typography variant="caption" color="textSecondary">In Progress</Typography>
          </Box>
        </Stack>
        
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: STATUS_COLORS[2],
            }}
          />
          <Box>
            <Typography variant="subtitle2">23%</Typography>
            <Typography variant="caption" color="textSecondary">Non-Compliant</Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

const RACIDistributionChart = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ height: 300, mt: 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={raciData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.divider
            }}
          />
          <Legend />
          <Bar dataKey="client" name="Client Admin" stackId="a" fill="#76ABAE" radius={[4, 4, 0, 0]} />
          <Bar dataKey="auditor" name="Auditor" stackId="a" fill="#31363F" radius={[4, 4, 0, 0]} />
          <Bar dataKey="owner" name="Project Owner" stackId="a" fill="#5f8a8c" radius={[4, 4, 0, 0]} />
          <Bar dataKey="contributor" name="Contributor" stackId="a" fill="#4a4f57" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

const DistributionCharts = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            height: '100%',
            borderRadius: 2,
            border: theme => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="chart tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Company Projects" />
              <Tab label="RACI Distribution" />
              <Tab label="Project Types" />
            </Tabs>
          </Box>
          
          {tabValue === 0 && <CompanyProjectsChart />}
          {tabValue === 1 && <RACIDistributionChart />}
          {tabValue === 2 && <ProjectTypeDistribution />}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button color="primary" size="small">
              View Full Report
            </Button>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={5}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            height: '100%',
            borderRadius: 2,
            border: theme => `1px solid ${theme.palette.divider}`,
          }}
        >
          <ComplianceStatusChart />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DistributionCharts;