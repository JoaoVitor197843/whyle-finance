import { api } from "../../api/apiConnect";
import axios from "axios";
// import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
// import { handleApiFormErrors } from "../../api/handleApiErrors";
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

interface UserInformationData {
    username: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    created_at: string
}
// interface PatchUsernameData {
//     username: string;
//     password: string;
// }
// interface PatchNameData {
//     first_name: string;
//     last_name: string;
//     password: string;
// }
// interface ChangePassword {
//     current_password: string;
//     new_password: string;
// }

const UserInformation = () => {
    // const {handleSubmit: handleUsernameSubmit, setError: setUsernameError, control: usernameControl} = useForm<PatchUsernameData>();
    // const {handleSubmit: handlePasswordSubmit, setError: setPasswordError, control: passwordControl} = useForm<ChangePassword>(); 
    // const {handleSubmit: handleNameSubmit, setError: setNameError, control: nameControl} = useForm<PatchNameData>();
    const [informations, setInformations] = useState<UserInformationData | null>(null);
    // const [apiError, setApiError] = useState<string>("");
    // const [isOpen, setIsOpen] = useState({
    //     password: false,
    //     username: false,
    //     name: false,
    //     delete: false
    // })
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
    // const onUsernameSubmit = async (data: PatchUsernameData) => {
    //     try {
    //         const response = await api.patch('/user/change-username/', data)
    //         setInformations(response.data.data)
    //         } catch (err) {
    //             if (axios.isAxiosError(err)) {
    //                 handleApiFormErrors(err.response?.data, setUsernameError, setApiError)
    //             }
    //         }
    // }
    // const onNameSubmit = async (data: PatchNameData) => {
    //     try {
    //         const response = await api.patch('/user/change-name/', data)
    //         setInformations(response.data.data)
    //         } catch (err) {
    //             if (axios.isAxiosError(err)) {
    //                 handleApiFormErrors(err.response?.data, setNameError, setApiError)
    //             }
    //         }
    // }
    // const onPasswordSubmit = async (data: ChangePassword) => {
    //     try {
    //         const response = await api.patch('/user/change-password', data)
    //         setInformations(response.data.data)
            
    //         } catch (err) {
    //             if (axios.isAxiosError(err)) {
    //                 handleApiFormErrors(err.response?.data, setPasswordError, setApiError)
    //             }
    //         }
    // }
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
            <Button variant="contained">Change Email</Button>
            </Stack>
            <Divider/>
            <Stack justifyContent={'space-between'} flexDirection={'row'} m={2}>
            <Typography alignSelf={'center'}>Username: {informations?.username}</Typography>
            <Button variant="contained">Change Username</Button>
            </Stack>
            <Divider/>
            <Stack justifyContent={'space-between'} flexDirection={'row'} m={2}>
            <Typography alignSelf={'center'}>First Name: {informations?.first_name}</Typography>
            <Typography alignSelf={'center'}>Last Name: {informations?.last_name}</Typography>
            <Button variant="contained">Change Name</Button>
            </Stack>
            <Divider/>
            <Stack alignItems={'center'} flexDirection={'column'} my={2} mt='auto' gap={3}>
            <Button variant="contained" sx={{p: 1}}>Change Password</Button>
            <Button variant="contained" color='error' sx={{p: 1}}>Delete Account</Button>
            </Stack>
        </Box>
    )
}

export default UserInformation