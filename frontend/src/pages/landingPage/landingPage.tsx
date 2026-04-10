import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline"
import landingTheme from "./landingTheme";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box"

const LandingPage = () => {
    return (
        <ThemeProvider theme={landingTheme}>
            <CssBaseline />
            <AppBar color="transparent" sx={{p: 2}} position="fixed">
                <Toolbar sx={{justifyContent: "space-between"}}>
                <Typography variant="h6" component="div" color="black">Whyle<Typography variant="h6" component="span" color="primary">Finance</Typography></Typography>
                <Stack direction="row">
                    <Button sx={{color: "black", fontWeight: 500, fontSize: "1rem"}}>Features</Button>
                    <Button sx={{color: "black", fontWeight: 500, fontSize: "1rem"}}>How it works</Button>
                </Stack>
                <Button color="primary" variant="contained" sx={{fontWeight: 500, fontSize: "1rem"}}>Get started free</Button>
                </Toolbar>
            </AppBar>
            <Box sx={{mt: "96px", minHeight: "calc(100vh - 96px)"}}>
            <Container maxWidth="lg">
                <Grid container spacing={2} justifyContent="center">
                <Grid size={{xs: 12, md: 8}}>
                    <Stack alignItems="center" justifyContent="center" textAlign="center" spacing={1}>
                        <Typography variant="h2">Your Finances,</Typography>
                        <Typography variant="h2" color="primary">Truly organized</Typography>
                        <Typography textAlign="center" maxWidth="460px" p={5}>Track expenses, set goals, and understand where your money goes - all in one place</Typography>
                    </Stack>
                </Grid>
                    
                </Grid>
            </Container>
            </Box>
        </ThemeProvider>
    )
}

export default LandingPage