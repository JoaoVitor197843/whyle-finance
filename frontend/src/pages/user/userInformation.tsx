import { api } from "../../api/apiConnect";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { handleApiFormErrors } from "../../api/handleApiErrors";
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ReturnIcon from '@mui/icons-material/KeyboardReturn';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogAction from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import CloseIcon from '@mui/icons-material/Close';
interface UserInformationData {
    username: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    created_at: string
}
interface PatchUsernameData {
    username: string;
    password: string;
}
interface PatchNameData {
    first_name: string;
    last_name: string;
    password: string;
}
interface ChangePassword {
    current_password: string;
    new_password: string;
}
interface DeleteData {
    password: string;
    delete: string;
}
const UserInformation = () => {
    const {handleSubmit: handleUsernameSubmit, setError: setUsernameError, control: usernameControl, reset: usernameReset, setValue: setUsernameValue} = useForm<PatchUsernameData>();
    const {handleSubmit: handlePasswordSubmit, setError: setPasswordError, control: passwordControl, reset: passwordReset} = useForm<ChangePassword>(); 
    const {handleSubmit: handleNameSubmit, setError: setNameError, control: nameControl, reset: nameReset, setValue: setNameValue} = useForm<PatchNameData>();
    const {handleSubmit: handleDeleteSubmit, setError: setDeleteError, control: deleteControl, reset: deleteReset} = useForm<DeleteData>();
    const [informations, setInformations] = useState<UserInformationData | null>(null);
    const [apiError, setApiError] = useState<string>("");
    const [isOpen, setIsOpen] = useState({
        password: false,
        username: false,
        name: false,
        delete: false,
        confirmDelete: false
    })
    const navigate = useNavigate();
    useEffect(() => {
        const verifyUserInfo = async () => {
            try {
                const response = await api.get('/user/me/')
                setInformations(response.data.data)
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    return
                }
            }
        };
        void verifyUserInfo();
    }, [])
    useEffect(() => {
        if (informations) {
            setUsernameValue('username', informations?.username)
            if(informations.first_name) {
            setNameValue('first_name', informations?.first_name)
            }
            if(informations.last_name) {
            setNameValue('last_name', informations?.last_name)
            }
        }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [informations])
    const onUsernameSubmit = async (data: PatchUsernameData) => {
        try {
            const response = await api.patch('/user/change-username/', data)
            setInformations(response.data.data)
            setIsOpen(prev => ({...prev, username: !prev.username}))
            usernameReset();
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    handleApiFormErrors(err.response?.data, setUsernameError, setApiError)
                }
            }
    }
    const onNameSubmit = async (data: PatchNameData) => {
        try {
            const response = await api.patch('/user/change-name/', data)
            setInformations(response.data.data)
            setIsOpen(prev => ({...prev, name: !prev.name}))
            nameReset();
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    handleApiFormErrors(err.response?.data, setNameError, setApiError)
                }
            }
    }
    const onPasswordSubmit = async (data: ChangePassword) => {
        try {
            const response = await api.patch('/user/change-password/', data)
            setInformations(response.data.data)
            setIsOpen(prev => ({...prev, password: !prev.password}))
            passwordReset();
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    handleApiFormErrors(err.response?.data, setPasswordError, setApiError)
                }
            }
    }
    const onDeleteSubmit = async (data: DeleteData) => {
        try {
            await api.post('/user/delete-account/', {password: data.password})
            void navigate('/')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                handleApiFormErrors(err.response?.data, setDeleteError, setApiError)
            }
        }
    }
    return (
        <Box height={'100vh'} display={"flex"} flexDirection={'column'}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton sx={{width: 48, height: 48}} onClick={() => navigate('/home')}>
                        <ReturnIcon />
                    </IconButton>
                    <Typography variant="h3" fontSize={{xs: '2rem', sm: '3rem'}} textAlign={'center'} flexGrow={1}>User Informations</Typography>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Stack justifyContent={'space-between'} flexDirection={'row'} m={2}>
            <Typography alignSelf={'center'}>Email: {informations?.email}</Typography>
            </Stack>
            <Divider/>
            <Stack justifyContent={'space-between'} flexDirection={'row'} m={2}>
            <Typography alignSelf={'center'}>Username: {informations?.username}</Typography>
            <Button variant="contained" onClick={() => setIsOpen(prev => ({...prev, username: !prev.username}))}>Change Username</Button>
            </Stack>
            <Divider/>
            <Stack justifyContent={'space-between'} flexDirection={'row'} m={2}>
            <Typography alignSelf={'center'}>First Name: {informations?.first_name}</Typography>
            <Typography alignSelf={'center'}>Last Name: {informations?.last_name}</Typography>
            <Button variant="contained" onClick={() => setIsOpen(prev => ({...prev, name: !prev.name}))}>Change Name</Button>
            </Stack>
            <Divider/>
            <Stack alignItems={'center'} flexDirection={'column'} my={2} mt='auto' gap={3}>
            <Button variant="contained" sx={{p: 1}} onClick={() => setIsOpen(prev => ({...prev, password: !prev.password}))}>Change Password</Button>
            <Button variant="contained" color='error' sx={{p: 1}} onClick={() => setIsOpen(prev => ({...prev, delete: !prev.delete}))}>Delete Account</Button>
            </Stack>
            <Dialog open={isOpen.username} onClose={() => {setIsOpen(prev => ({...prev, username: !prev.username})); usernameReset();}}>
                <DialogAction>
                    <IconButton onClick={() => {setIsOpen(prev => ({...prev, username: !prev.username})); usernameReset();}}>
                        <CloseIcon/>
                    </IconButton>
                </DialogAction>
                <DialogTitle>Change Username</DialogTitle>
                <Box component={'form'} onSubmit={handleUsernameSubmit(onUsernameSubmit)} noValidate>
                    <DialogContent>
                    <Controller 
                    name="username"
                    control={usernameControl}
                    rules={{required: 'Username is required'}}
                    render={({field, fieldState}) => (
                        <TextField 
                        {...field}
                        label='Username'
                        helperText={fieldState.error?.message || ' '}
                        margin="dense"
                        required
                        fullWidth
                        error={!!fieldState.error}
                        variant="outlined"
                        autoComplete="nickname"
                        />
                    )}/>
                    <Controller
                    name="password"
                    control={usernameControl}
                    rules={{required: 'Password is required'}}
                    render={({field, fieldState}) => (
                        <TextField 
                        {...field}
                        label='Password'
                        helperText={fieldState.error?.message || ' '}
                        margin="dense"
                        fullWidth
                        error={!!fieldState.error}
                        variant="outlined"
                        autoComplete="password"
                        type="password"
                        required/>
                    )}/>
                    <DialogContentText color="error">{apiError ? apiError : ' '}</DialogContentText>
                    <DialogAction sx={{alignItems: 'center', display: 'flex', justifyContent: "center"}}>
                        <Button type="submit" variant="contained">Change Username</Button>
                    </DialogAction>
                    </DialogContent>
                </Box>
            </Dialog>
            <Dialog open={isOpen.name} onClose={() => {setIsOpen(prev => ({...prev, name: !prev.name})); nameReset();}}>
                <DialogAction>
                    <IconButton onClick={() => {setIsOpen(prev => ({...prev, name: !prev.name})); nameReset();}}>
                        <CloseIcon/>
                    </IconButton>
                </DialogAction>
                <DialogTitle>Change Name</DialogTitle>
                <Box component={'form'} onSubmit={handleNameSubmit(onNameSubmit)} noValidate>
                    <DialogContent>
                        <Box display='grid' gridTemplateColumns={'1fr 1fr'} gap={1}>
                            <Controller 
                            name="first_name"
                            control={nameControl}
                            rules={{required: 'First name is required'}}
                            render={({field, fieldState}) => (
                                <TextField 
                                {...field}
                                label='First Name'
                                helperText={fieldState.error?.message || ' '}
                                margin="dense"
                                error={!!fieldState.error}
                                variant="outlined"
                                autoComplete="given-name"
                                fullWidth
                                required
                                />
                            )}/>
                            <Controller 
                            name="last_name"
                            control={nameControl}
                            render={({field, fieldState}) => (
                                <TextField 
                                {...field}
                                label='Last Name'
                                helperText={fieldState.error?.message || ' '}
                                margin="dense"
                                error={!!fieldState.error}
                                variant="outlined"
                                autoComplete="family-name"
                                fullWidth
                                />
                            )}/>
                        </Box>
                    <Controller
                    name="password"
                    control={nameControl}
                    rules={{required: 'Password is required'}}
                    render={({field, fieldState}) => (
                        <TextField 
                        {...field}
                        label='Password'
                        helperText={fieldState.error?.message || ' '}
                        margin="dense"
                        fullWidth
                        error={!!fieldState.error}
                        variant="outlined"
                        required
                        type="password"
                        autoComplete="password"/>
                    )}/>
                    <DialogContentText color="error">{apiError ? apiError : ' '}</DialogContentText>
                    <DialogAction sx={{alignItems: 'center', display: 'flex', justifyContent: "center"}}>
                        <Button type="submit" variant="contained">Change name</Button>
                    </DialogAction>
                    </DialogContent>
                </Box>
            </Dialog>
            <Dialog open={isOpen.password} onClose={() => {setIsOpen(prev => ({...prev, password: !prev.password})); passwordReset();}}>
                <DialogAction>
                    <IconButton onClick={() => {setIsOpen(prev => ({...prev, password: !prev.password})); passwordReset();}}>
                        <CloseIcon/>
                    </IconButton>
                </DialogAction>
                <DialogTitle>Change password</DialogTitle>
                <Box component={'form'} onSubmit={handlePasswordSubmit(onPasswordSubmit)} noValidate>
                    <DialogContent>
                    <Controller 
                    name="current_password"
                    control={passwordControl}
                    rules={{required: 'The current password is required'}}
                    render={({field, fieldState}) => (
                        <TextField 
                        {...field}
                        label='Current Password'
                        type="password"
                        helperText={fieldState.error?.message || ' '}
                        margin="dense"
                        fullWidth
                        error={!!fieldState.error}
                        variant="outlined"
                        autoComplete="password"
                        required
                        />
                    )}/>
                    <Controller
                    name="new_password"
                    control={passwordControl}
                    rules={{required: 'The new password is required'}}
                    render={({field, fieldState}) => (
                        <TextField 
                        {...field}
                        type="password"
                        label='New Password'
                        helperText={fieldState.error?.message || ' '}
                        margin="dense"
                        fullWidth
                        error={!!fieldState.error}
                        variant="outlined"
                        autoComplete="new-password"
                        required/>
                    )}/>
                    <DialogContentText color="error">{apiError ? apiError : ' '}</DialogContentText>
                    <DialogAction sx={{alignItems: 'center', display: 'flex', justifyContent: "center"}}>
                        <Button type="submit" variant="contained">Change password</Button>
                    </DialogAction>
                    </DialogContent>
                </Box>
            </Dialog>
            
            <Dialog open={isOpen.delete} onClose={() => setIsOpen(prev => ({...prev, delete: !prev.delete, confirmDelete: !prev.confirmDelete}))}>
                <DialogAction>
                    <IconButton onClick={() => {setIsOpen(prev => ({...prev, delete: !prev.delete, confirmDelete: !prev.confirmDelete})); deleteReset();}}>
                        <CloseIcon/>
                    </IconButton>
                </DialogAction>
                <DialogTitle>Delete Account</DialogTitle>
                <Box component={'form'} onSubmit={handleDeleteSubmit(onDeleteSubmit)} noValidate>
                    <DialogContent>
                        {isOpen.confirmDelete ? 
                        (
                        <>
                            <Controller 
                            name="password"
                            control={deleteControl}
                            rules={{required: 'Password is required'}}
                            render={({field, fieldState}) => (
                                <TextField 
                                {...field}
                                type="password"
                                label='Password'
                                helperText={fieldState.error?.message || ' '}
                                margin="dense"
                                fullWidth
                                error={!!fieldState.error}
                                variant="outlined"
                                autoComplete="password"
                                required/>
                            )}
                            />
                            <Controller 
                            name="delete"
                            control={deleteControl}
                            rules={{validate: (value) => value === 'DELETE' || 'Type DELETE to confirm'}}
                            render={({field, fieldState}) => (
                                <TextField 
                                {...field}
                                type="text"
                                label='Type DELETE to confirm'
                                helperText={fieldState.error?.message || ' '}
                                margin="dense"
                                fullWidth
                                error={!!fieldState.error}
                                variant="outlined"
                                autoComplete="password"
                                required/>
                            )}
                            />
                            <DialogAction sx={{display: 'flex', justifyContent: 'center', gap: 5}}>
                                <Button variant="contained" onClick={() => {setIsOpen(prev => ({...prev, delete: false, confirmDelete: false})); deleteReset();}}>Cancel</Button> 
                                <Button variant="contained"  type={'submit'} color="error">Delete Account</Button>
                            </DialogAction>
                        </>
                        ) : (<>
                        <DialogContentText>This action will permanently delete your account and all data.</DialogContentText>
                        <DialogContentText>Are you sure yo want to delete your account?</DialogContentText>
                        <DialogAction sx={{display: 'flex', justifyContent: 'center', gap: 5}}>
                            <Button variant="contained" onClick={() => {setIsOpen(prev => ({...prev, delete: false, confirmDelete: false})); deleteReset();}}>Cancel</Button> 
                            <Button variant="contained"  color="error" onClick={() => setIsOpen(prev => ({...prev, confirmDelete: true}))}>Delete Account</Button>
                    </DialogAction>
                        </>)}
                    </DialogContent>
                </Box>
            </Dialog>

        </Box>
    )
}

export default UserInformation