import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText,
  CssBaseline, Box, Typography, Button, Collapse, Card, CardContent, CardActions, Modal, TextField,
} from '@mui/material';
import {
  Dashboard as DashboardIcon, ListAlt, Info, AccountCircle, ExpandLess, ExpandMore, Search, History, Description, Person,
} from '@mui/icons-material';
import logo from './image/logo.png';
import { googleLogout } from '@react-oauth/google';
import DetailAkun from './detailakun'; // Pastikan ini digunakan di suatu tempat

function ManageAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile || JSON.parse(localStorage.getItem('profile'));

  const [openDataItems, setOpenDataItems] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [openSearchModal, setOpenSearchModal] = useState(false); // State untuk modal pencarian
  const [openDetailModal, setOpenDetailModal] = useState(false); // State untuk modal detail
  const [selectedUser, setSelectedUser] = useState(null); // State untuk menyimpan user yang dipilih

  const handleDataItemsClick = () => {
    setOpenDataItems((prev) => !prev);
  };

  const handleAccountClick = () => {
    setOpenAccount((prev) => !prev);
  };

  const logout = () => {
    googleLogout();
    localStorage.removeItem('detail');
    navigate('/');
  };

  const handleSearchModalOpen = () => setOpenSearchModal(true);
  const handleSearchModalClose = () => setOpenSearchModal(false);

  const handleDetailModalOpen = (user) => {
    setSelectedUser(user);
    setOpenDetailModal(true);
  };

  const handleDetailModalClose = () => {
    setOpenDetailModal(false);
    setSelectedUser(null);
  };

  if (!profile) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 4 }}>
        Tidak ada profil ditemukan. Silakan login.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'black' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <img src={logo} alt="Logo" style={{ height: '50px', marginRight: '10px' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h7" color="white">PT SAT NUSAPERSADA Tbk</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'white', fontWeight: 'bold' }}>
                High Technology Electronics Manufacturers
              </Typography>
            </Box>
          </Box>
          <Button variant="contained" color="error" onClick={logout}>Log Out</Button>
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
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={handleDataItemsClick}>
            <ListItemIcon><ListAlt /></ListItemIcon>
            <ListItemText primary="Data Items" />
            {openDataItems ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openDataItems} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/searchadmin">
                <ListItemIcon><Search /></ListItemIcon>
                <ListItemText primary="Search" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/createadmin">
                <ListItemIcon><Description /></ListItemIcon>
                <ListItemText primary="Create" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/history">
                <ListItemIcon><History /></ListItemIcon>
                <ListItemText primary="History" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button component={Link} to="/aboutadmin">
            <ListItemIcon><Info /></ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
          <ListItem button onClick={handleAccountClick}>
            <ListItemIcon><AccountCircle /></ListItemIcon>
            <ListItemText primary="Account" />
            {openAccount ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openAccount} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/profileadmin">
                <ListItemIcon><AccountCircle /></ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/manageadmin">
                <ListItemIcon><AccountCircle /></ListItemIcon>
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

        {/* ACCOUNT SECTION */}
        <Box sx={{ bgcolor: 'white', p: 2, borderRadius: '8px', mb: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>ACCOUNT</Typography>
        </Box>

        {/* MANAGE SECTION */}
        <Box sx={{ bgcolor: 'white', p: 2, borderRadius: '8px', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ color: 'black', fontWeight: 'bold' }}>Manage</Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: 'lightblue', color: 'black' }}
              onClick={handleSearchModalOpen} // Buka modal saat diklik
            >
              + ADD
            </Button>
          </Box>

          {/* USER ACCOUNT CARDS IN HORIZONTAL STYLE */}
          <Box display="flex" flexDirection="row" gap={2} sx={{ bgcolor: 'white', p: 3, borderRadius: '8px', mt: 2 }}>
            {[{ name: 'SULYINO', type: 'WORKER' }, { name: 'JONI', type: 'MANAGER' }, { name: 'SARAH', type: 'STAFF' }].map((user, index) => (
              <Card
                key={index}
                sx={{
                  width: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  bgcolor: '#e0e0e0',
                  borderRadius: '8px',
                  border: '1px solid black',
                }}
              >
                <Person sx={{ fontSize: 40, color: 'black', mr: 2 }} />
                <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{user.type}</Typography>
                </CardContent>
                <CardActions sx={{ marginLeft: 'auto' }}>
                  <Button variant="contained" size="small" sx={{ mt: 1 }} onClick={() => handleDetailModalOpen(user)}>
                    Detail
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Box>

        {/* MODAL SEARCH */}
        <Modal open={openSearchModal} onClose={handleSearchModalClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 4,
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>ADD USER</Typography>
            <TextField label="NAME" variant="outlined" fullWidth sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 15 }}>
            <Button variant="contained" onClick={handleSearchModalClose}
              sx={{ mr: 1, backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSearchModalClose}>
              Create
              </Button>

            </Box>
          </Box>
        </Modal>

        {/* MODAL DETAIL */}
        <DetailAkun open={openDetailModal} user={selectedUser} onClose={handleDetailModalClose} />
      </Box>
    </Box>
  );
}

export default ManageAdmin;
