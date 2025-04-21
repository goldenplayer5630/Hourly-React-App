// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#0E1C36', // your brand blue
    },
    secondary: {
      main: '#AFCBFF', // optional secondary
    },
    background: {
      default: '#f9f9f9',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '2rem',
    },
    button: {
      textTransform: 'none', // no uppercase on buttons
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
  },
});

export default theme;
