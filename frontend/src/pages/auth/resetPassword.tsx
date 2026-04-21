import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../api/apiConnect";
import { handleApiFormErrors } from "../../api/handleApiErrors";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from '@mui/icons-material/Lock'
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface resetPasswordForm {
    new_password: string,
    confirm_password: string
}

const ResetPassword = () => {
    const [SearchParams] = useSearchParams();
    const uid = SearchParams.get('uid');
    const token = SearchParams.get('token');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    })
    const {control, handleSubmit, getValues, setError} = useForm<resetPasswordForm>();
    const [apiError, setApiError] = useState<string>("")

    useEffect(() => {
        const verifyToken = async () => {
            if (!uid || !token) {
                void navigate('/forgot-password')
                return;
            }
            try {
            await api.get(`/auth/reset-password/?uid=${uid}&token=${token}`)
            } catch {
                void navigate('/forgot-password')
            }
        }
        void verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onSubmit = async (data: resetPasswordForm) => {
        try {
            await api.post('/auth/reset-password/', {...data, uid: uid, token: token})
            void navigate('/login')
        } catch(err: unknown) {
            if (axios.isAxiosError(err)) {
                handleApiFormErrors(err.response?.data, setError, setApiError)
            }
        }
    }

    return (
        <>
            <Dialog open>
                <DialogTitle>Reset your password</DialogTitle>
                    <DialogContent>
                        <Box component={"form"} onSubmit={handleSubmit(onSubmit)} display={'flex'} gap={2} flexDirection={'column'} noValidate>
                            <Controller
                            name="new_password"
                            control={control}
                            defaultValue={""}
                            rules={{required: 'You need to put a new password'}}
                            render={({field, fieldState}) => (
                                <TextField 
                                {...field}
                                label='Password'
                                type={showPassword.password ? "text" : "password"}
                                error={!!fieldState.error}
                                fullWidth
                                required
                                helperText={fieldState.error?.message || " "}
                                autoComplete="new-password"
                                margin="dense"
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton onClick={() => setShowPassword(prev => ({...prev, password: !prev.password}))}>
                                                    {showPassword.password ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon />
                                            </InputAdornment>
                                        )
                                    },
                                    inputLabel: {shrink: true},
                                }}/>
                            )}
                            />
                            <Controller
                            name="confirm_password"
                            control={control}
                            defaultValue={""}
                            rules={{
                                required: 'You need to confirm your password!',
                                validate: (value) => value === getValues('new_password') || "The password don't match"
                            }}
                            render={({field, fieldState}) => (
                                <TextField 
                                {...field}
                                label='Confirm Password'
                                type={showPassword.confirmPassword ? 'text' : "password"}
                                error={!!fieldState.error}
                                fullWidth
                                required
                                helperText={fieldState.error?.message || " "}
                                autoComplete="new-password"
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton onClick={() => setShowPassword(prev => ({...prev, confirmPassword: !prev.confirmPassword}))}>
                                                    {showPassword.confirmPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon />
                                            </InputAdornment>
                                        )
                                    }
                                }}/>
                            )}
                            />
                            <Button variant="contained" type="submit" fullWidth sx={{
                                mt: 2,
                                py: 1.5,
                                borderRadius: 3,
                                fontWeight: 600
                            }}>Reset your password</Button>
                        </Box>
                        
                    </DialogContent>
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
        </>
    )
}

export default ResetPassword