import { api } from "../../api/apiConnect";
import { handleApiErrors } from "../../api/handleApiErrors";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from "@mui/material/Alert";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

interface ForgotData {
    email: string
}

const ForgotPassword = () => {
    const [error, setError] = useState<Record<string, string> | null>(null);
    const {handleSubmit, control} = useForm<ForgotData>();
    const onSubmit = async (data: ForgotData) => {
        try {
            await api.post('auth/forgot-password/', data)
        } catch (err: unknown){
            if (axios.isAxiosError(err)){
            handleApiErrors(err.response?.data, setError)
            }
        }
    }
    return (
    <>
        <Dialog open>
            <Box component={'form'} onSubmit={handleSubmit(onSubmit)} noValidate>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogContent>
                <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{required: 'Email is required'}}
                render={({field, fieldState}) => (
                    <TextField 
                    {...field}
                    margin="dense"
                    label='Email'
                    type="email"
                    error={!!fieldState.error}
                    fullWidth
                    required
                    helperText={fieldState.error?.message || " "}/>
                )}
                />

                <Button variant="contained" type="submit" fullWidth sx={{
                    mt: 2, 
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600
                }}>Reset Password</Button>
            </DialogContent>
            </Box>
        </Dialog>
        {error && <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{vertical: 'bottom', horizontal: "right"}}>
            <Alert severity='error' onClose={() => setError(null)}>
                {Object.entries(error).map(([, message]) => message)}
            </Alert>
        </Snackbar>}
    </>
    )
}

export default ForgotPassword