import { Link as RouterLink} from 'react-router-dom';
import { TextField, Button, Box, Typography, Card, CardContent, Link, InputAdornment, IconButton} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useState } from 'react';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { register } from '../../api/auth/register';
import { handleApiErrors } from '../../api/handleApi';

type FormData = {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    confirm_password: string;
}

export default function Register() {
    const { control, handleSubmit, watch, setError} = useForm<FormData>();
    const [ showPassword, setShowPassword ] = useState(false);
    const [ showConfirmationPassword, setShowConfirmationPassword ] = useState(false);
    const [apiError, setApiError] = useState<string>("");
    const onSubmit = async (data: FormData) => {
        setApiError("")
        try {
            await register(data);
        } catch (err: any) {
            handleApiErrors(err.response.data, setError, setApiError)
        }
    }
    return (
        <Card sx={{borderRadius: 4, p: 3, width: {xs: '90vw', sm: 'auto'}, maxHeight: '90vh', overflowY: 'auto'}}>
            <CardContent>
                <Box mb={{xs: 2, sm: 5}}>
                    <Typography variant={'h4'} sx={{ fontSize: {xs: '1.8rem', sm: '2.5rem'}}}>Create Account</Typography>
                </Box>
                <Box display='flex' component='form' flexDirection='column' gap={3.5} onSubmit={handleSubmit(onSubmit)} noValidate>
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
                        variant='standard'
                        required
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
                        variant='standard'
                        required
                        fullWidth/>
                    )}/>
                    <Box display='grid' gridTemplateColumns={'1fr 1fr'} gap={1}>
                    <Controller 
                    name='first_name'
                    control={control}
                    defaultValue=''
                    render={({ field }) => (
                        <TextField 
                        {...field}
                        label='First Name'
                        variant='standard'
                        fullWidth/>
                    )}/>
                    <Controller 
                    name='last_name'
                    control={control}
                    defaultValue=''
                    render={({ field }) => (
                        <TextField 
                        {...field}
                        label='Last Name'
                        variant='standard'
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
                        type={showPassword ? "text" : 'password'}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || " "}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton onClick={() => setShowPassword(prev => !prev)}>
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                        variant='standard'
                        required
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
                        type={showConfirmationPassword ? "text" : 'password'}
                        label='Confirm Password'
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || " "}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton onClick={() => setShowConfirmationPassword(prev => !prev)}>
                                            {showConfirmationPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                        variant='standard'
                        required
                        fullWidth/>
                    )}/>
                    <Typography color='error'>{apiError ? apiError : " "}</Typography>
                    <Button variant="contained" type="submit" fullWidth sx={{
                        mt: 2,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600
                    }}>Create Account</Button>
                    <Box textAlign="end" mt={1}>
                        <Typography variant="body2">
                            Already have an account?{" "}
                            <Link component={RouterLink} to="/" sx={{fontWeight: 600}}>Sign In</Link>
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}