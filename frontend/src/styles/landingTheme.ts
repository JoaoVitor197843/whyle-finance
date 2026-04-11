// src/styles/themes/landingTheme.ts
import { createTheme } from '@mui/material/styles'

const landingTheme = createTheme({
  palette: {
    primary: {
      main: '#BA7517',
      light: '#EF9F27',
      dark: '#633806',
      contrastText: '#fff',
    },
    secondary: {
      main: '#2C2C2A',
      light: '#5F5E5A',
      contrastText: '#fff',
    },
    background: {
      default: '#ffffff',
      paper: '#FAEEDA',
    },
    text: {
      primary: '#2C2C2A',
      secondary: '#5F5E5A',
      disabled: '#B4B2A9',
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Roboto", sans-serif',
    h1: { fontFamily: '"DM Serif Display", serif', fontWeight: 500 },
    h2: { fontFamily: '"DM Serif Display", serif', fontWeight: 500 },
    h3: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none"
        }
      }
    }
  }
})

export default landingTheme