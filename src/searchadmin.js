import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText,
  CssBaseline, Box, Typography, Button, Collapse, IconButton, TextField,
  Modal
} from '@mui/material';
import {
  Dashboard as DashboardIcon, ListAlt, Info, AccountCircle, ExpandLess, ExpandMore, Search, History, Description, FilterList, Add
} from '@mui/icons-material';
import logo from './image/logo.png';
import { googleLogout } from '@react-oauth/google';

function SearchAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile || JSON.parse(localStorage.getItem('profile'));

  const [openDataItems, setOpenDataItems] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [setOpenSearchModal] = useState(false); // State untuk modal pencarian
  const [openDetailModal, setOpenDetailModal] = useState(false); // State untuk modal detail
  const [selectedItem, setSelectedItem] = useState(null); // State untuk menyimpan item yang dipilih

  const handleDataItemsClick = () => {
    setOpenDataItems((prev) => !prev);
  };

  const handleAccountClick = () => {
    setOpenAccount((prev) => !prev);
  };

  const handleSearchModalOpen = () => setOpenSearchModal(true);
  

  const handleDetailModalOpen = (item) => {
    setSelectedItem(item); // Set item yang dipilih untuk detail
    setOpenDetailModal(true); // Buka modal detail
  };
  const handleDetailModalClose = () => setOpenDetailModal(false);

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
    <Box sx={{ display: 'flex' }}>
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
              <ListItem button sx={{ pl: 4 }} component={Link} to="/history">
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

        {/* DATA ITEMS */}
        <Box sx={{ bgcolor: 'white', p: 2, borderRadius: '8px', mb: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
            DATA ITEMS
          </Typography>
        </Box>

        {/* DATA TABLE */}
        <Box sx={{ bgcolor: 'white', p: 2, borderRadius: '8px', mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 0 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
              DATA TABLES
            </Typography>
          </Box>

          <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="FILTER BY"
              sx={{
                borderRadius: '20px',
                bgcolor: 'white',
                border: '1px solid black',
                width: '150px',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              }}
              InputProps={{
                startAdornment: (
                  <IconButton sx={{ p: 0, mr: 1 }}>
                    <FilterList />
                  </IconButton>
                ),
              }}
            />
            <TextField
              size="small"
              variant="outlined"
              placeholder="SEARCH"
              sx={{
                borderRadius: '20px',
                bgcolor: 'lightblue',
                width: '150px',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              }}
              InputProps={{
                startAdornment: (
                  <IconButton sx={{ p: 0, mr: 1 }} onClick={handleSearchModalOpen}> {/* Menambahkan aksi untuk membuka modal */}
                    <Search />
                  </IconButton>
                ),
              }}
            />
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 0 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
              
            </Typography>
            <Button color="primary" startIcon={<Add />}>
              ADD ALL {/* Menambahkan kembali tombol "+ ADD ALL" */}
            </Button>
          </Box>

          <Box component="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '3px solid #ddd', padding: '8px', backgroundColor: '#e0e0e0' }}>NO</th>
                <th style={{ border: '3px solid #ddd', padding: '8px', backgroundColor: '#e0e0e0' }}>ITEM</th>
                <th style={{ border: '3px solid #ddd', padding: '8px', backgroundColor: '#e0e0e0' }}>TYPE</th>
                <th style={{ border: '3px solid #ddd', padding: '8px', backgroundColor: '#e0e0e0' }}>CREATION DATE</th>
                <th style={{ border: '3px solid #ddd', padding: '8px', backgroundColor: '#e0e0e0' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {/* Looping untuk menampilkan data item */}
              {[{ id: 1, name: 'Item 1', type: 'Handphone', creationDate: '2024-01-01' }, { id: 2, name: 'Item 2', type: 'Tablet', creationDate: '2024-02-01' }].map((item, index) => (
                <tr key={item.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.type}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.creationDate}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <Button onClick={() => handleDetailModalOpen(item)} variant="outlined" color="primary">
                      Detail
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>

        {/* Modal Detail */}
        <Modal open={openDetailModal} onClose={handleDetailModalClose}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            bgcolor: 'white', padding: 4, borderRadius: 2, boxShadow: 24
          }}>
            {selectedItem && (
              <>
                <Typography variant="h6" gutterBottom>Detail Item</Typography>
                <Typography>Name: {selectedItem.name}</Typography>
                <Typography>Type: {selectedItem.type}</Typography>
                <Typography>Creation Date: {selectedItem.creationDate}</Typography>
              </>
            )}
            <Button onClick={handleDetailModalClose} color="error" sx={{ mt: 2 }}>Close</Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default SearchAdmin;
