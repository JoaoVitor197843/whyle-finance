import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    'primary': {
      main: "#d4af37"
    },
    'background': {
      default: "#1e1e1e",
      paper: '#555555'
    }

  }
});

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
    <ThemeProvider theme={theme}>
      <App />
      </ThemeProvider>
    </BrowserRouter>
)
