import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText,
  CssBaseline, Box, Typography, Button, Collapse, Modal, TextField
} from '@mui/material';
import {
  Dashboard as DashboardIcon, ListAlt, Info, AccountCircle, ExpandLess, ExpandMore, Search, History, Description,
} from '@mui/icons-material';
import logo from './image/logo.png';
import { googleLogout } from '@react-oauth/google';
import AccountDetails from './EditProfile'; 

function CreateAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile || JSON.parse(localStorage.getItem('profile'));

  const [openDataItems, setOpenDataItems] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [profileState, setProfileState] = useState(profile || {}); // Initial profile state
  const [tempProfile, setTempProfile] = useState({ name: '', phone: '' }); // Temporary state for editing

  const handleDataItemsClick = () => {
    setOpenDataItems((prev) => !prev);
  };

  const handleAccountClick = () => {
    setOpenAccount((prev) => !prev);
  };

  const handleOpenEditModal = () => {
    setTempProfile({ name: profileState.name, phone: profileState.phone });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleOpenAlertModal = () => {
    setOpenAlertModal(true);
  };

  const handleCloseAlertModal = () => {
    setOpenAlertModal(false);
  };

  const handleUpdateProfile = () => {
    setProfileState(tempProfile);
    handleCloseEditModal();
    handleOpenAlertModal();
  };

  const logout = () => {
    googleLogout();
    localStorage.removeItem('profile');
    navigate('/');
  };

  if (!profile) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 4 }}>
        Tidak ada profil ditemukan. Silakan login.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'black' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <img src={logo} alt="Logo" style={{ height: '50px', marginRight: '10px' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h7" color="white">
                PT SAT NUSAPERSADA Tbk
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'white', fontWeight: 'bold' }}>
                High Technology Electronics Manufacturers
              </Typography>
            </Box>
          </Box>
          <Button variant="contained" color="error" onClick={logout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button component={Link} to="/dashboardadmin">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem button onClick={handleDataItemsClick}>
            <ListItemIcon>
              <ListAlt />
            </ListItemIcon>
            <ListItemText primary="Data Items" />
            {openDataItems ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openDataItems} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/searchadmin">
                <ListItemIcon>
                  <Search />
                </ListItemIcon>
                <ListItemText primary="Search" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/createadmin">
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText primary="Create" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/historyadmin">
                <ListItemIcon>
                  <History />
                </ListItemIcon>
                <ListItemText primary="History" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button component={Link} to="/aboutadmin">
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>

          <ListItem button onClick={handleAccountClick}>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="Account" />
            {openAccount ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openAccount} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/profileadmin">
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/manageadmin">
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Manage" />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#f0f0f0',
          height: '100vh',
        }}
      >
        <Toolbar />

        <Box sx={{ display: 'flex', gap: 1, height: '90%' }}>
          <Box sx={{ p: 1, borderRadius: '5px', display: 'flex', flexDirection: 'column', alignItems: 'right', flex: 4 }}>
            <Box sx={{ bgcolor: '#ffffff', height: '350px', width: '300px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AccountCircle sx={{ fontSize: '100px' }} />
            </Box>
            <Box sx={{ bgcolor: 'red', mt: 2, width: '300px', height: '480px', borderRadius: '4px' }} />
          </Box>

          <Box sx={{ bgcolor: 'white', p: 6, borderRadius: '4px', flex: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <AccountDetails profile={profileState} handleOpenEditModal={handleOpenEditModal} />
          </Box>
        </Box>

        {/* Edit Profile Modal */}
        <Modal open={openEditModal} onClose={handleCloseEditModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper', p: 4, borderRadius: 5 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Edit Profile
            </Typography>

            {/* Daftar atribut yang dapat diedit */}
            {[{ label: "NAME", value: profileState.name || 'ADMIN', isEditable: true },
              { label: "NIK", value: "45312342" },
              { label: "BORN DATE", value: "12 August 1987" },
              { label: "DEPARTMENT", value: "ADMIN" },
              { label: "PHONE", value: profileState.phone || '087251742212', isEditable: true },
              { label: "PERIOD", value: "AVAILABLE", color: 'green', underline: true }
            ].map((item, index) => (
              <Box key={index} sx={{ display: 'flex', mb: 4, alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', minWidth: '200px' }}>
                  {item.label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
                  :
                </Typography>
                {item.isEditable ? (
                  <TextField
                    variant="outlined"
                    value={tempProfile[item.label.toLowerCase()]} // Ganti dengan tempProfile
                    onChange={(e) => setTempProfile({ ...tempProfile, [item.label.toLowerCase()]: e.target.value })} // Update tempProfile
                    fullWidth
                  />
                ) : (
                  <Typography variant="h6">
                    {item.value}
                  </Typography>
                )}
              </Box>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
                Update
              </Button>
              <Button variant="outlined" onClick={handleCloseEditModal} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Alert Modal for Profile Update */}
        <Modal open={openAlertModal} onClose={handleCloseAlertModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, bgcolor: 'background.paper', p: 4, borderRadius: 5 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              Your Account Has Been Updated!
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleCloseAlertModal}>
                OK
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default CreateAdmin;
