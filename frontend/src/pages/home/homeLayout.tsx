import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import { useTheme } from "@mui/material/styles";
import { useNavigate, Outlet } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Home from "@mui/icons-material/Home";
import { useState } from "react";
export const HomeLayout = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const theme = useTheme()
    const navigate = useNavigate()
    const handleClose = () => setAnchorEl(null)
    const [openMobile, setOpenMobile] = useState(false)
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const drawerWidth = 'clamp(180px, 20vw, 280px)'
    return (
        <>
        <Drawer
        variant={isMobile ? "temporary" : 'permanent'}
        open={isMobile ? openMobile : true}
        onClose={() => setOpenMobile(false)}
        sx={{
            width: drawerWidth,
            '& .MuiDrawer-paper': {width: drawerWidth}
        }}>
            <List>
                <ListItemButton onClick={() => navigate('/home')}>
                    <ListItemIcon>
                        <Home />
                    </ListItemIcon>
                    <ListItemText primary='Home'/>
                </ListItemButton>
            </List>
        </Drawer>
        <AppBar position="fixed" sx={{ml: drawerWidth, width: {sm: `calc(100% - ${drawerWidth})`}}}>
            <Toolbar sx={{ minHeight: '48px !important'}}> 
                <IconButton sx={{display: {sm: 'none'}}} onClick={() => setOpenMobile(true)}>
                    <MenuIcon />
                </IconButton>
                <Box sx={{flexGrow: 1}} />
                    <IconButton onClick={handleOpen} size="large">
                        <AccountCircle />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
                        <MenuItem onClick={() => navigate('/login')}>
                            Login
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/register')}>
                            Register
                        </MenuItem>
                    </Menu>
            </Toolbar >
        </AppBar>
        <Box sx={{height: '48px'}}/>
        <Box sx={{ml: {sm: drawerWidth}, width: {sm: `calc(100% - ${drawerWidth})`}, height: 'calc(100vh - 48px)', justifyContent: "center", alignItems: "center", display: "flex"}}>
            <Outlet />
        </Box>
        </>
    )
}