import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext.tsx';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    'primary': {
      main: "#d4af37"
    },
    'error': {main: '#cf6679'},
    'success': {main: '#03dac6'},
    'background': {
      default: "#1e1e1e",
      paper: '#2a2a2a'
    },
    text: {
      primary: '#d4d4d4'
    },
    divider: '#555555'

  }
});

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
)

