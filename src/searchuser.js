import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText,
  CssBaseline, Box, Typography, Button, Collapse, IconButton, TextField,
  Modal
} from '@mui/material';
import {
  Dashboard as DashboardIcon, ListAlt, Info, AccountCircle, ExpandLess, ExpandMore, Search, Description, Add
} from '@mui/icons-material';
import logo from './image/logo.png';
import { googleLogout } from '@react-oauth/google';

function SearchUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile || JSON.parse(localStorage.getItem('profile'));

  const [openAccount, setOpenAccount] = useState(false);
  const [openDataItems, setOpenDataItems] = useState(false);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [barangData, setbarangData] = useState(null);

  const handleNavigate = (id) => {
    navigate('/createuser?ids=' + id);
  };

  const handleNavigateAll = () => {

    if (!barangData) {
      alert('Data barang tidak ditemukan.');
      return;
    }
    
    const id = barangData.map((item) => item.id).join(',');
    navigate('/createuser?ids=' + id);
  };

  const handleDataItemsClick = () => {
    setOpenDataItems((prev) => !prev);
  };

  const handleAccountClick = () => {
    setOpenAccount((prev) => !prev);
  };

  const handleSearchModalOpen = () => setOpenSearchModal(true);
  const handleDetailModalOpen = (item) => {
    setSelectedItem(item);
    setOpenDetailModal(true);
  };
  const handleDetailModalClose = () => setOpenDetailModal(false);

  const logout = () => {
    googleLogout();
    localStorage.removeItem('profile');
    navigate('/');
  };

  const [formData, setFormData] = useState({
    name: '',
    code_item: '',
    category: '',
    creation_date: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSearchModal = async () => {
    try {

      if (!formData.name || !formData.code_item || !formData.category || !formData.creation_date) {
        alert('Semua field harus diisi!');
        return; // Hentikan eksekusi jika ada field yang kosong
      }
      
      // Kirim data ke API /api/pegawai
      const response = await axios.get('http://127.0.0.1:8000/dummy/search', {
        params: formData
      });

      setbarangData(response.data); // Simpan data ke state

      setOpenSearchModal(false); // Menutup modal
      setFormData({ // Reset form
        name: '',
        code_item: '',
        category: '',
        creation_date: '',
      });
    } catch (error) {
      console.error('Error creating Search:', error);
      alert('Gagal mencari data barang. Silakan coba lagi.');
    }
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
          <ListItem button component={Link} to="/dashboarduser">
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
              <ListItem button sx={{ pl: 4 }} component={Link} to="/searchuser">
                <ListItemIcon>
                  <Search />
                </ListItemIcon>
                <ListItemText primary="Search" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/createuser">
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText primary="Create" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button component={Link} to="/aboutuser">
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
          <ListItem button component={Link} to="/account">
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItem>
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
              placeholder="SEARCH"
              sx={{
                borderRadius: '20px',
                bgcolor: 'lightblue',
                width: '150px',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              }}
              InputProps={{
                startAdornment: (
                  <IconButton sx={{ p: 0, mr: 1 }} onClick={handleSearchModalOpen}>
                    <Search />
                  </IconButton>
                ),
              }}
            />
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 0 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
              
            </Typography>
            <Button color="primary" onClick={() => handleNavigateAll()} startIcon={<Add />}>
              ADD ALL
            </Button>
          </Box>

          <Box component="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '3px solid #ddd', padding: '8px', backgroundColor: '#e0e0e0' }}>NO</th>
                <th style={{ border: '3px solid #ddd', padding: '8px', backgroundColor: '#e0e0e0' }}>NAME</th>
                <th style={{ border: '3px solid #ddd', padding: '8px', backgroundColor: '#e0e0e0' }}>CATEGORY</th>
                <th style={{ border: '3px solid #ddd', padding: '8px', backgroundColor: '#e0e0e0' }}>CREATION DATE</th>
                <th style={{ border: '3px solid #ddd', padding: '8px', backgroundColor: '#e0e0e0' }}>ACTION</th>
                <th style={{ border: '3px solid #ddd', padding: '8px', backgroundColor: '#e0e0e0' }}>ADD</th>
              </tr>
            </thead>
            <tbody>
              {barangData?.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.category}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{moment(item.creation_date).locale('id').format('D MMMM YYYY')}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => handleDetailModalOpen(item)}
                    >
                      DETAIL
                    </Button>
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    <Button variant="contained" size="small" color="primary" onClick={() => handleNavigate(item.id)}>Add</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>

        {/* Modal Detail */}
        <Modal open={openDetailModal} onClose={handleDetailModalClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              padding: 4,
              borderRadius: 2,
              boxShadow: 24,
              width: 400,
            }}
          >
            {selectedItem && (
              <>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    mb: 3,
                  }}
                >
                  DETAIL ITEM
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 20px 1fr',
                    rowGap: 1.5,
                    columnGap: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 'bold' }}>Name</Typography>
                  <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>:</Typography>
                  <Typography>{selectedItem.name}</Typography>

                  <Typography sx={{ fontWeight: 'bold' }}>Code Items</Typography>
                  <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>:</Typography>
                  <Typography>{selectedItem.code_item}</Typography>

                  <Typography sx={{ fontWeight: 'bold' }}>Category</Typography>
                  <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>:</Typography>
                  <Typography>{selectedItem.category}</Typography>

                  <Typography sx={{ fontWeight: 'bold' }}>Creation Date</Typography>
                  <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>:</Typography>
                  <Typography>{moment(selectedItem.creation_date).locale('id').format('D MMMM YYYY')}</Typography>

                  <Typography sx={{ fontWeight: 'bold' }}>Storage Location</Typography>
                  <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>:</Typography>
                  <Typography>{selectedItem.storage_location}</Typography>

                  <Typography sx={{ fontWeight: 'bold' }}>Stok</Typography>
                  <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>:</Typography>
                  <Typography>{selectedItem.stok} PCS</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    onClick={handleDetailModalClose}
                    color="error"
                    variant="contained"
                    size="small"
                  >
                    Close
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>

        {/* Modal Pencarian */}
        <Modal open={openSearchModal} onClose={() => setOpenSearchModal(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              padding: 6,
              borderRadius: 2,
              boxShadow: 24,
              width: { xs: '95%', sm: 600 },
              overflowY: 'auto',
            }}
          >
            {/* Header Modal */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'left', mb: 3 }}>
              SEARCH
            </Typography>

            {/* Input Fields */}
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                size="medium"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <TextField
                label="Code Items"
                variant="outlined"
                fullWidth
                size="medium"
                name="code_item"
                value={formData.code_item}
                onChange={handleInputChange}
              />
              <TextField
                label="Category"
                variant="outlined"
                fullWidth
                size="medium"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
              <TextField
                label="Date Created"
                variant="outlined"
                fullWidth
                size="medium"
                type="date"
                name="creation_date"
                value={formData.creation_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            {/* Buttons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                mt: 4,
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => setOpenSearchModal(false)}
                sx={{
                  fontSize: '1rem',
                  padding: '5px 15px',
                  minWidth: '9px',
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearchModal}
                sx={{
                  fontSize: '1rem',
                  padding: '5px 15px',
                  minWidth: '90px',
                }}
              >
                Search
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default SearchUser;