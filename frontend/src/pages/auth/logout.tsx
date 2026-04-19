import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useEffect, useState } from 'react';
import { api } from '../../api/apiConnect';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert'
import { handleApiErrors } from '../../api/handleApiErrors';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
    const [isLogout, setIsLogout] = useState<null | boolean>(null);
    const [error, setError] = useState<Record<string, string> | null>({});
    const [count, setCount] = useState(5);
    const navigate = useNavigate();
    useEffect(() => {
        const logout = async () => {
            try {
                await api.post('/auth/logout/')
                setIsLogout(true)
            } catch (err: unknown){
                if (axios.isAxiosError(err)) {
                handleApiErrors(err.response?.data, setError)
                }
                setIsLogout(false)
            }
        }
        void logout();
    }, [])
        
    useEffect(() => {
        if(isLogout) {
            const interval = setInterval(() => {
                            setCount(prev => {
                                if(prev === 1) {
                                    clearInterval(interval)
                                    void navigate('/')
                                }
                                return prev - 1
                            })
                        }, 1000)
                        return () => clearInterval(interval)
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLogout])
    if(isLogout === null) return <CircularProgress />
    return (
        <Box>
            {isLogout ? (<Dialog open>
                <DialogTitle>User logged out successfully</DialogTitle>
                <DialogContent>
                    <DialogContentText>You are now logged out. You'll be redirected in {count} seconds</DialogContentText>
                </DialogContent>
            </Dialog>) : 
            (error && <Snackbar open anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
                <Alert severity='error'>
                    {Object.entries(error).map(([, message]) => message)}
                </Alert>
            </Snackbar>)}
            
        </Box>
    )
}

export default Logout