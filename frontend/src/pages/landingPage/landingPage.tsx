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
import Grid from "@mui/material/Grid"
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BarChartIcon from '@mui/icons-material/BarChart';
import CategoryIcon from '@mui/icons-material/Category';
import SecurityIcon from '@mui/icons-material/Security';

const features = [
    {
        icon: <AccountBalanceWalletIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
        title: 'Track Transactions',
        description: 'Record your income and expenses easily, with categories and detailed history.'
    },
    {
        icon: <BarChartIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
        title: 'Visual Reports',
        description: 'Understand your finances with interactive charts for expenses, income and balance over time.'
    },
    {
        icon: <CategoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
        title: 'Custom Categories',
        description: 'Organize your transactions with custom categories for income and expenses.'
    },
    {
        icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
        title: 'Secure & Private',
        description: 'Your data is protected with JWT authentication and HttpOnly cookies.'
    },
]

const LandingPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <ThemeProvider theme={landingTheme}>
            <CssBaseline />
            <AppBar sx={{p: 2, backgroundColor: "background.default"}} position="fixed">
                <Toolbar sx={{justifyContent: "space-between"}}>
                    <Typography variant="h6" component="div" color="black" mr={1}>
                        Whyle<Typography variant="h6" component="span" color="primary">Finance</Typography>
                    </Typography>
                    <Stack direction="row" display={isMobile ? 'none' : 'flex'}>
                        <Button sx={{color: "black", fontWeight: 500, fontSize: "1rem"}}>Features</Button>
                        <Button sx={{color: "black", fontWeight: 500, fontSize: "1rem"}}>How it works</Button>
                    </Stack>
                    <Button onClick={() => navigate('/register')} color="primary" variant="contained" sx={{fontWeight: 500, fontSize: "1rem"}}>Get started free</Button>
                </Toolbar>
            </AppBar>

            <Box sx={{mt: "96px"}} />

            <Container maxWidth="lg">
                <Box component="section" sx={{ pt: 12, pb: 10 }}>
                    <Stack alignItems="center" justifyContent="center" textAlign="center" direction="column">
                        <Paper elevation={2} sx={{color: 'primary.main', py: 0.5, px: "14px", '&:hover': {boxShadow: 6}}}>
                            Personal finance, simplified
                        </Paper>
                        <Typography variant="h2" sx={{mt: 3}}>Your Finances,</Typography>
                        <Typography variant="h2" color="primary">Truly organized</Typography>
                        <Typography textAlign="center" variant="body1" maxWidth="500px" sx={{mt: 2}}>
                            Track expenses, set goals, and understand where your money goes - all in one place
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{mt: 4}}>
                            <Button onClick={() => navigate('/register')} color="primary" variant="contained" size="large" sx={{fontWeight: 600, px: 4}}>
                                Get started free
                            </Button>
                            <Button onClick={() => navigate('/login')} variant="outlined" color="primary" size="large" sx={{fontWeight: 600, px: 4}}>
                                Sign in
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Container>

            <Box sx={{ backgroundColor: '#f9f6f1', py: 10 }} id="features">
                <Container maxWidth="lg">
                    <Typography variant="h4" textAlign="center" fontWeight={700} mb={1}>
                        Everything you need to manage your money
                    </Typography>
                    <Typography variant="body1" textAlign="center" color="text.secondary" mb={6}>
                        Simple, powerful tools to keep your finances under control
                    </Typography>
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                <Paper elevation={0} sx={{
                                    p: 3,
                                    height: '100%',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 3,
                                    '&:hover': { boxShadow: 4, borderColor: 'primary.main' },
                                    transition: 'all 0.2s'
                                }}>
                                    {feature.icon}
                                    <Typography variant="h6" fontWeight={600} mt={2} mb={1}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ py: 10, textAlign: 'center' }}>
                <Container maxWidth="sm">
                    <Typography variant="h4" fontWeight={700} mb={2}>
                        Ready to take control of your finances?
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={4}>
                        Join WhyleFinance and start tracking your money today. It's free.
                    </Typography>
                    <Button onClick={() => navigate('/register')} color="primary" variant="contained" size="large" sx={{fontWeight: 600, px: 6}}>
                        Get started free
                    </Button>
                </Container>
            </Box>

            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', py: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    © 2026 WhyleFinance. All rights reserved.
                </Typography>
            </Box>

        </ThemeProvider>
    )
}

export default LandingPage
