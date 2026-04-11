import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline"
import landingTheme from "../../styles/landingTheme";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box"
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <ThemeProvider theme={landingTheme}>
            <CssBaseline />
            <AppBar sx={{p: 2, backgroundColor: "background.default"}} position="fixed">
                <Toolbar sx={{justifyContent: "space-between"}}>
                <Typography variant="h6" component="div" color="black">Whyle<Typography variant="h6" component="span" color="primary">Finance</Typography></Typography>
                <Stack direction="row">
                    <Button sx={{color: "black", fontWeight: 500, fontSize: "1rem"}}>Features</Button>
                    <Button sx={{color: "black", fontWeight: 500, fontSize: "1rem"}}>How it works</Button>
                </Stack>
                <Button onClick={() => navigate('/register')} color="primary" variant="contained" sx={{fontWeight: 500, fontSize: "1rem"}}>Get started free</Button>
                </Toolbar>
            </AppBar>
            <Box sx={{mt: "96px"}} />
                
                <Container maxWidth="lg">
                    <Box component="section" sx={{
                        pt: 12,
                        pb: 10
                    }}>
                        <Stack alignItems="center" justifyContent="center" textAlign="center" direction="column">
                            <Paper elevation={2} sx={{color: 'primary.main', py: 0.5, px: "14px", '&:hover': {boxShadow: 6}}}>Personal finance, simplified</Paper>
                            <Typography variant="h2" sx={{mb: 4, mt: 3}}>Your Finances,</Typography>
                            <Typography variant="h2" color="primary">Truly organized</Typography>
                            <Typography textAlign="center" variant="body1"  maxWidth="500px">Track expenses, set goals, and understand where your money goes - all in one place</Typography>
                        </Stack>
                    </Box>
                </Container>
        </ThemeProvider>
    )
}

export default LandingPage