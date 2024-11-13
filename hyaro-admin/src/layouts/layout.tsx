import { Box, AppBar, IconButton, Toolbar, Drawer, Divider, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material"
import { Menu } from '@mui/icons-material'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../components/hoc/AuthController"
import { Role } from "../types/interfaces"
import { When } from "../components/hoc/When"

export const Layout = () => {

  const navigate = useNavigate()
  const auth = useAuth()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const drawerWidth = 240;

  let navItems: string[] = []
  const navItemsForAdmin = ['Products', 'Orders', 'Customize', 'My Users', 'Gifts', 'Verify', 'Add Users', 'Announcement', 'Sign Out'];
  const navItemsForVendors = ['Products', 'Orders', 'Gifts', 'Sign Out'];
  const navItemsForDeliveryPerson = ['Orders', 'Sign Out']

  if (auth?.roles.includes(Role.VENDOR) || auth?.roles.includes(Role.SUPPLIER)) {
    navItems = [...navItemsForVendors]
  }

  if (auth?.roles.includes(Role.ADMIN)) {
    navItems = [...navItemsForAdmin]
  }

  if (auth?.roles.includes(Role.DELIVERY)) {
    navItems = [...navItemsForDeliveryPerson]
  }

  const handleClick = (linkName: string) => {
    if (linkName === "Products") {
      navigate('')
    }
    if (linkName === 'Sign Out') {
      auth?.unsetUser()
      navigate('/auth/signin')
    }

    if (linkName === 'Orders') {
      navigate('/order')
    }

    if (linkName === 'Customize') {
      navigate('/customize')
    }

    if (linkName === 'My Users') {
      navigate('/my-users')
    }

    if (linkName === 'Gifts') {
      navigate('/gifts')
    }

    if (linkName === 'Verify') {
      navigate('/verify')
    }

    if (linkName === 'Add Users') {
      navigate('/add-users')
    }

    if (linkName === 'Announcement') {
      navigate('/announcement')
    }
  }

  const drawer = (
    <Box onClick={() => setSidebarOpen(prev => !prev)} sx={{ textAlign: 'center', p: "2.5em 0em" }}>
      <Box component="img" src="/logo.svg" alt="Hyaroo" p="0.5em 0em" />
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}
              onClick={() => handleClick(item)}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setSidebarOpen(prev => !prev)}
            >
              <Menu />
            </IconButton>
            <When condition={!!auth?.loggedIn}>
              <Typography variant="subtitle1" alignSelf="center">Hello, {auth?.fullName}</Typography>
            </When>
            <When condition={!auth?.loggedIn}>
              <Typography variant="subtitle1" alignSelf="center">HYAROO ADMIN DASHBOARD</Typography>
            </When>
          </Toolbar>
        </AppBar>
      </Box>
      <nav>
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  )
}


