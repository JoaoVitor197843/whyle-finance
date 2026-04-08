import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { verifyEmail } from "../../api/auth/verifyEmail";
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, Snackbar, Alert } from "@mui/material";
import { handleApiErrors } from "../../api/handleApiErrors";


export function VerifyEmail() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<Record<string, string>>({})
    const [count, setCount] = useState(5)
    useEffect(() => {
        if(status === 'success') {
            const interval = setInterval(() => {
                            setCount(prev => {
                                if(prev === 1) {
                                    clearInterval(interval)
                                    navigate('/login')
                                }
                                return prev - 1
                            })
                        }, 1000)
                        return () => clearInterval(interval)
        }
    }, [status])

    useEffect(() => {
        const token = params.get('token');
        const uid = params.get('uid');
        const verify = async () => {
            try {
            await verifyEmail({token: token, uid: uid})
            
            setStatus("success")
            } catch(err: any) {
                handleApiErrors(err.response.data, setError)
                setStatus('error')
            }
        }
        verify()
    }, [])

    return (
        <> 
            {status === 'loading' && <CircularProgress />}
            <Dialog open={status === 'success'}>
                <DialogTitle>Email Verified Successfully!</DialogTitle>
                <DialogContent>
                    <DialogContentText>Your email has been verified! You will be redirected in {count} seconds.</DialogContentText>
                </DialogContent>
            </Dialog>
            
            <Snackbar open={status === 'error'} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
                <Alert severity="error">
                    {Object.entries(error).map(([_ , message]) => message)}
                </Alert>
            </Snackbar>
        </> 
    )
}