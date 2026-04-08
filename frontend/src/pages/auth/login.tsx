import { TextField, Button, Box, Typography, Card, CardContent, Link, InputAdornment, IconButton, Snackbar, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { Link as RouterLink} from "react-router-dom";
import { useState } from "react";
import { login } from "../../api/auth/login";
import { handleApiFormErrors } from "../../api/handleApiErrors";

type FormData = {
    email: string;
    password: string;
}

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const {control, handleSubmit, setError, } = useForm<FormData>();
    const [apiError, setApiError] = useState<string>("");
    const onSubmit = async (data: FormData) => {
        try {
            await login(data);
        } catch (err: any) {
            handleApiFormErrors(err.response.data, setError, setApiError)
        }
    }

    return (
        <>
        <Card sx={{borderRadius: 4, p: 3, width: {xs: '90vw', sm: 'auto'}, maxHeight: '90vh', maxWidth: '320px', overflowY: 'auto'}}>
        <CardContent>
            <Box mb={{xs: 2,sm: 5}}>
                <Typography variant="h4" sx={{fontSize: {xs: "1.8rem", sm: "2.5rem"}}}>Sign In</Typography>
            </Box>
            <Box display="flex" component="form" flexDirection='column' gap={1} onSubmit={handleSubmit(onSubmit)} noValidate>
                
                <Controller 
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: "Email required"}}
                render={({ field, fieldState}) => (
                    <TextField 
                    {...field}
                    label='Email'
                    type="email"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || " "}
                    variant="outlined"
                    required
                    autoComplete="email"
                    fullWidth/>
                )}
                />
                    <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{required: "Password required"}}
                    render={({field, fieldState}) =>(
                    <TextField 
                    {...field}
                    label='Password' 
                    type={showPassword? "text": "password"}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || " "}
                    variant="outlined"
                    required
                    autoComplete="current-password"
                    fullWidth
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
                        }}/>)}/>
                    <Typography color='error'>{apiError ? apiError : " "}</Typography>
                    <Button variant="contained" type="submit" fullWidth sx={{
                        mt: 2,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600
                    }}>Login</Button>
                    <Box textAlign="end" mt={1}>
                        <Typography variant="body2">
                            Don't have an account?{" "}
                            <Link component={RouterLink} to="/register" sx={{fontWeight: 600}}>Sign Up</Link>
                        </Typography>
                    </Box>
            </Box>
       </CardContent>
       </Card>
        <Snackbar
        open={!!apiError}
        autoHideDuration={4000}
        onClose={() => setApiError('')}
        anchorOrigin={{vertical: 'bottom', horizontal: "right"}}>
            <Alert severity='error' onClose={() => setApiError('')}>
                {apiError}
            </Alert>
        </Snackbar>
    </>
    )
}