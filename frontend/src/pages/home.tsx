import { AppBar, Toolbar,IconButton, Box, Menu, MenuItem, useMediaQuery, Drawer, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
export function Home() {
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
            </Toolbar>
        </AppBar>
        </>
    )
}