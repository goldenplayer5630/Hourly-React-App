// src/theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') => {
  const basePalette: ThemeOptions['palette'] = {
    mode,
    primary: {
      main: mode === 'dark' ? '#AFCBFF' : '#0E1C36', // your brand blue
    },
    secondary: {
      main: mode === 'dark' ? '#0E1C36' : '#0E1C36', // light blue in dark mode, fallback in light
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#f9f9f9',
      paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
    },
  };
  

  return createTheme({
    palette: basePalette,
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 14,
      h1: {
        fontSize: '2rem',
      },
      button: {
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
    },
  });
};
