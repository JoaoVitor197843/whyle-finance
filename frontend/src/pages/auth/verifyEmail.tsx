import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { verifyEmail } from "../../api/auth/verifyEmail";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import DialogContentText from "@mui/material/DialogContentText"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";
import { handleApiErrors } from "../../api/handleApiErrors";


export const VerifyEmail = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<Record<string, string> | null>({})
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
            
            {error && <Snackbar open={status === 'error'} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
                <Alert severity="error">
                    {Object.entries(error).map(([_ , message]) => message)}
                </Alert>
            </Snackbar>}
        </> 
    )
}