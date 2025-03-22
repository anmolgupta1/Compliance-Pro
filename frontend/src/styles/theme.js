// src/styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#76ABAE',
    },
    secondary: {
      main: '#31363F',
    },
    background: {
      default: '#EEEEEE',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#222831',
      secondary: '#31363F',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 24px',
        },
      },
    },
  },
});

export default theme;