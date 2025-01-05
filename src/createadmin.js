import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useLocation, useNavigate, Link,useSearchParams } from 'react-router-dom';
import {
  AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText,
  CssBaseline, Box, Typography, Button, Collapse, TextField, Modal,
  FormControl, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import {
  Dashboard as DashboardIcon, ListAlt, Info, AccountCircle, ExpandLess, ExpandMore, Search, History, Description
} from '@mui/icons-material';
import logo from './image/logo.png';
import { googleLogout } from '@react-oauth/google';

function CreateAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile || JSON.parse(localStorage.getItem('profile'));

  const [searchParams] = useSearchParams();
  const ids = searchParams.get('ids');
  const idArray = ids ? ids.split(',') : [];

  const [barangData, setBarangData] = useState(null);

  useEffect(() => {
    if (ids !== null) {
      axios
        .get(`http://127.0.0.1:8000/dummy?ids=${idArray}`)
        .then((response) => {
          setBarangData(response.data); // Simpan data ke state
        })
        .catch((error) => {
          console.error('Error fetching data barang:', error);
        });
    }
  }, [ids]); // Tambahkan id ke dalam array dependensi


  const [formData, setFormData] = useState({
    nama_file: '',
    creator: '',
  });

  useEffect(() => {
    if (profile?.name && formData.creator !== profile.name) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        creator: profile.name,
      }));
    }
  }, [profile, formData.creator]); 


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleCreate = async () => {
    try {

      if(ids == null) {
        alert('Data barang tidak boleh kosong.' );
        return;
      }
      if (formData.nama_file.trim() === '') {
        alert('Nama file tidak boleh kosong.' );
        return;
      }

      const payload = {
        ...formData,
        barang: barangData // Menambahkan barangData ke dalam formData
      };

      console.log(payload);

      const response = await axios.post('http://127.0.0.1:5000/api/file', payload, {
        responseType: 'blob' // Penting untuk mengatur responseType agar menerima file binary
      });
  
      // Jika request berhasil dan file diterima sebagai Blob
      const downloadLink = document.createElement('a');
      const file = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
      // Buat URL objek untuk file
      const fileURL = URL.createObjectURL(file);
      downloadLink.href = fileURL;
      downloadLink.download = `${formData.nama_file}.xlsx`; // Nama file saat diunduh
      downloadLink.click(); // Triggers the download


      alert('Data Created succesfully')

      setFormData({ // Reset form
        nama_file: '',
      });
    } catch (error) {
      console.error('Error creating Search:', error);
      alert('Gagal menambah data file. Silakan coba lagi.');
    }
  };


  const [openDataItems, setOpenDataItems] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [fileFormat, setFileFormat] = useState('excel'); 
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDataItemsClick = () => {
    setOpenDataItems((prev) => !prev);
  };

  const handleAccountClick = () => {
    setOpenAccount((prev) => !prev);
  };

  const handleDetailClick = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedItem(null);
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
              CREATE FILE
            </Typography>
          </Box>

          <Box component="table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr>
                <th style={{ border: '3px solid #ddd', padding: '8px', backgroundColor: '#e0e0e0' }}>NO</th>
                <th style={{ border: '3px solid #ddd', padding: '8px', backgroundColor: '#e0e0e0' }}>NAME</th>
                <th style={{ border: '3px solid #ddd', padding: '8px', backgroundColor: '#e0e0e0' }}>CATEGORY</th>
                <th style={{ border: '3px solid #ddd', padding: '8px', backgroundColor: '#e0e0e0' }}>CREATION DATE</th>
                <th style={{ border: '3px solid #ddd', padding: '8px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>ACTION</th>
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
                      onClick={() => handleDetailClick(item)}
                    >
                      DETAIL
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Box>

          {/* Format File Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>
              Format File:
            </Typography>
            <FormControl component="fieldset" sx={{ mt: 1 }}>
              <RadioGroup
                row
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value)}
              >
                <FormControlLabel
                  value="excel"
                  control={<Radio checked={fileFormat === 'excel'} />}
                  label="Microsoft Excel"
                  sx={{ fontWeight: 'normal' }}
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* File Name Section */}
          <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>
              Nama File:
            </Typography>
            <TextField
              variant="outlined"
              name="nama_file"
              value={formData.nama_file}
              onChange={handleInputChange}
              placeholder="Masukkan nama file"
              size="small"
              sx={{ width: '300px' }}
            />
          </Box>

          <Button variant="contained" onClick={handleCreate} color="success" sx={{ mt: 2 }}>
            Create & DOWNLOAD
          </Button>
        </Box>
      </Box>

      {/* Modal for Item Details */}
      <Modal open={openModal} onClose={handleCloseModal}>
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
                  onClick={handleCloseModal}
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
    </Box>
  );
}

export default CreateAdmin;
