import { useNavigate, Link as RouterLink} from 'react-router-dom';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Dialog from '@mui/material/Dialog';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from '@mui/material/DialogContentText';
import { useForm, Controller } from "react-hook-form";
import { useState } from 'react';
import { register } from '../../api/auth/register';
import { handleApiFormErrors } from '../../api/handleApiErrors';

type FormData = {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    confirm_password: string;
}

export const Register = () =>  {
    const { control, handleSubmit, watch, setError} = useForm<FormData>();
    const [ showPassword, setShowPassword ] = useState({
        password: false,
        confirmPassword: false
    });
    const navigate = useNavigate()
    const [apiError, setApiError] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);
    const onSubmit = async (data: FormData) => {
        try {
            await register(data);
            setIsOpen(true)
        } catch (err: any) {
            handleApiFormErrors(err.response.data, setError, setApiError)
        }
    }
    return (
    <Box sx={{justifyContent: 'center', alignItems: 'center', height: "100vh", display: "flex"}}>
        <Card sx={{borderRadius: 4, p: 2, width: {xs: '90vw', sm: 'auto'}, maxHeight: '90vh', maxWidth: '400px', overflowY: 'auto'}}>
            <CardContent>
                <Box mb={2}>
                    <Typography variant={'h4'} sx={{ fontSize: 'clamp(1.8rem, 5vw, 2.2rem)', fontWeight: 700}}>Create Account</Typography>
                </Box>
                <Box display='flex' component='form' flexDirection='column' gap={1} onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Controller 
                    name='email'
                    control={control}
                    defaultValue=''
                    rules={{required: 'Email Required'}}
                    render={({ field,   fieldState }) => (
                        <TextField 
                        {...field}
                        label='Email'
                        type='email'
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || " "}
                        variant='outlined'
                        required
                        autoComplete='email'
                        fullWidth/>
                    )}/>
                    <Controller 
                    name='username'
                    control={control}
                    defaultValue=''
                    rules={{required: 'Username Required'}}
                    render={({ field,   fieldState }) => (
                        <TextField 
                        {...field}
                        label='Username'
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || " "}
                        variant='outlined'
                        required
                        autoComplete='username'
                        fullWidth/>
                    )}/>
                    <Box display='grid' gridTemplateColumns={'1fr 1fr'} gap={1}>
                    <Controller 
                    name='first_name'
                    control={control}
                    defaultValue=''
                    render={({ field, fieldState }) => (
                        <TextField 
                        {...field}
                        label='First Name'
                        variant='outlined'
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || " "}
                        autoComplete='given-name'
                        fullWidth/>
                    )}/>
                    <Controller 
                    name='last_name'
                    control={control}
                    defaultValue=''
                    render={({ field, fieldState }) => (
                        <TextField 
                        {...field}
                        label='Last Name'
                        variant='outlined'
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || " "}
                        autoComplete='family-name'
                        fullWidth/>
                    )}/>
                    </Box>
                    <Controller 
                    name='password'
                    control={control}
                    defaultValue=''
                    rules={{required: 'Password Required'}}
                    render={({ field,   fieldState }) => (
                        <TextField 
                        {...field}
                        label='Password'
                        type={showPassword.password ? "text" : 'password'}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || " "}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton onClick={() => setShowPassword(prev => ({...prev, password: !prev.password}))}>
                                            {showPassword.password ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                        variant='outlined'
                        required
                        autoComplete='new-password'
                        fullWidth/>
                    )}/>
                    <Controller 
                    name='confirm_password'
                    control={control}
                    defaultValue=''
                    rules={{
                    required: 'Confirmation password Required',
                    validate: (value) =>
                        value === watch('password') || "The passwords don't match"
                    }}
                    render={({ field,   fieldState }) => (
                        <TextField 
                        {...field}
                        type={showPassword.confirmPassword ? "text" : 'password'}
                        label='Confirm Password'
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || " "}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton onClick={() => setShowPassword(prev => ({...prev, confirmPassword: !prev.confirmPassword}))}>
                                            {showPassword.confirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                        variant='outlined'
                        required
                        autoComplete='new-password'
                        fullWidth/>
                    )}/>
                    <Button variant="contained" type="submit" fullWidth sx={{
                        mt: 2,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600
                    }}>Create Account</Button>
                    <Box textAlign="end" mt={1}>
                        <Typography variant="body2">
                            Already have an account?{" "}
                            <Link component={RouterLink} to="/login" sx={{fontWeight: 600}}>Sign In</Link>
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
        <Dialog open={isOpen} onClose={() => navigate('/login')} >
            <DialogTitle>Verify your email</DialogTitle>
            <DialogContent>
                    <DialogContentText>
                        We've sent a verification email to your account, please verify it to activate your account and access the platform.
                    </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => navigate('/login')}>OK</Button>
            </DialogActions>
        </Dialog>
        <Snackbar
        open={!!apiError}
        autoHideDuration={4000}
        onClose={() => setApiError('')}
        anchorOrigin={{vertical: 'bottom', horizontal: "right"}}>
            <Alert severity='error' onClose={() => setApiError('')}>
                {apiError}
            </Alert>
        </Snackbar>
    </Box>
    )
}