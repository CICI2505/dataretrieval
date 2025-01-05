import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Table,TableHead,TableBody,TableCell,TableRow, Drawer, List, ListItem, ListItemIcon, ListItemText,
  CssBaseline, Box, Typography, Button, Collapse, Modal, TextField,
} from '@mui/material';
import {
  Dashboard as DashboardIcon, ListAlt, Info, AccountCircle, ExpandLess, ExpandMore, Search, History, Description, 
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
  const [isLoading, setIsLoading] = useState(true);
  const [pegawaiData, setPegawaiData] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

    // Handle perubahan tanggal
    const handleDateChange = (date) => {
      // Menggunakan moment untuk memastikan format tanggal yang benar
      const formattedDate = date ? moment(date).format('YYYY-MM-DD') : ''; // Format tanggal
      setFormData({
        ...formData,
        bornDate: formattedDate, // Simpan tanggal yang diformat ke dalam formData
      });
    };

  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://127.0.0.1:5000/api/pegawai`)
      .then((response) => {
        setPegawaiData(response.data); // Simpan data ke state
        setIsLoading(false); // Hentikan loading
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
      });
  }, []); // Menambahkan array dependensi kosong
  

  const handleDataItemsClick = () => {
    setOpenDataItems((prev) => !prev);
  };

  const handleAccountClick = () => {
    setOpenAccount((prev) => !prev);
  };

  const handleDelete = (id) => {
    // Hapus user dari state
    setPegawaiData((prevUsers) => prevUsers.filter((pegawaiData) => pegawaiData.id !== id));
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    // Tidak perlu reset tempProfile di sini, karena perubahan tidak disimpan jika cancel
  };

  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    born_date: '',
    department: '',
    phone_number: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const [formData2, setFormData2] = useState({
    name: '',
    nik: '',
    born_date: '',
    department: '',
    phone_number: '',
    password: ''
  });
  
  // Sinkronisasi formData2 dengan selectedUser setelah selectedUser diubah
  useEffect(() => {
    if (selectedUser) {
      setFormData2({
        name: selectedUser.name || '',
        nik: selectedUser.nik || '',
        born_date: selectedUser.born_date || '',
        department: selectedUser.department || '',
        phone_number: selectedUser.phone_number || '',
        password: selectedUser.password || ''
      });
    }
  }, [selectedUser]);

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };


  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/pegawai/${selectedUser.id}`, {
        name: formData2.name,
        nik: formData2.nik,
        born_date: formData2.born_date,
        department: formData2.department,
        phone_number: formData2.phone_number,
        password: formData2.password
      });
  
      // Gunakan data dari response
      const updatedProfile = response.data.data;

      setPegawaiData((prevData) =>
        prevData.map((pegawai) =>
          pegawai.id === selectedUser.id ? updatedProfile : pegawai
        )
      );

      handleCloseEditModal();
      
        // Tampilkan alert setelah modal tertutup
    setTimeout(() => {
      alert('Pegawai berhasil diupdate!');
    }, 200); // Delay opsional untuk memastikan modal benar-benar tertutup
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Gagal memperbarui profil. Silakan coba lagi.');
    }
  };

  const handleCreateModal = async () => {
    try {
      // Kirim data ke API /api/pegawai
      const response = await axios.post('http://127.0.0.1:5000/api/pegawai', formData);
  
      if (response.status === 201) {
        // Update state dengan data baru yang ditambahkan
        setPegawaiData((prevData) => [...prevData, response.data.data]); // Menambahkan data baru ke state
  
        setOpenSearchModal(false); // Menutup modal
        setFormData({ // Reset form
          name: '',
          nik: '',
          born_date: '',
          department: '',
          phone_number: '',
          password: ''
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Gagal membuat pengguna. Silakan coba lagi.');
    }
  };
  

  const logout = () => {
    googleLogout();
    localStorage.clear();
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
            <Typography variant="h5" sx={{ color: 'black', fontWeight: 'bold' }}>MANAGE</Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: 'lightblue', color: 'black' }}
              onClick={handleSearchModalOpen} // Buka modal saat diklik
            >
              + ADD
            </Button>
          </Box>

  {/* USER ACCOUNT TABLE */}
  <Box sx={{ mt: 2 }}>
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>NAME</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>NIK</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>DEPARTMENT</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>ACTION</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {pegawaiData?.map((user, index) => (
          <TableRow key={index}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.nik}</TableCell>
            <TableCell>{user.department}</TableCell>
            <TableCell sx={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleDetailModalOpen(user)}
              >
                Detail
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleOpenEditModal(user)}
              >
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
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
            <TextField
          label="NAME"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          label="NIK"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          name="nik"
          value={formData.nik}
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          type="date"
          name="born_date"
          value={formData.born_date}
          onChange={handleInputChange}
        />
        <TextField
          label="DEPARTMENT"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          name="department"
          value={formData.department}
          onChange={handleInputChange}
        />
        <TextField
          label="PHONE"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          name="phone_number"
          value={formData.phone_number}
          onChange={handleInputChange}
        />
        <TextField
          label="PASSWORD"
          variant="outlined"
          fullWidth
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
            <Button variant="contained" onClick={handleSearchModalClose}
              sx={{ mr: 1, backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleCreateModal}>
              Create
              </Button>

            </Box>
          </Box>
        </Modal>

        {/* MODAL DETAIL */}
        <DetailAkun
          open={openDetailModal}
          user={selectedUser}
          onClose={handleDetailModalClose}
          onDelete={handleDelete} // Pass handleDelete to DetailAkun
        />  

        <Modal open={openEditModal} onClose={handleCloseEditModal}>
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
            {/* Header Modal */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'left', mb: 3 }}>
              Update Pegawai
            </Typography>

            {/* Input Fields */}
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                size="medium"
                name="name"
                value={formData2.name}
                onChange={handleInputChange2}
              />
              <TextField
                label="NIK"
                variant="outlined"
                fullWidth
                size="medium"
                name="nik"
                value={formData2.nik}
                onChange={handleInputChange2}
              />
              <TextField
                label="Born Date"
                variant="outlined"
                fullWidth
                size="medium"
                name="born_date"
                type="date"
                value={formData2.born_date}
                onChange={handleInputChange2}
              />
               <TextField
                label="Department"
                variant="outlined"
                fullWidth
                size="medium"
                name="department"
                value={formData2.department}
                onChange={handleInputChange2}
              />
                <TextField
                label="Phone"
                variant="outlined"
                fullWidth
                size="medium"
                name="phone_number"
                value={formData2.phone_number}
                onChange={handleInputChange2}
              />
                 <TextField
                label="Password"
                variant="outlined"
                fullWidth
                size="medium"
                name="password"
                value={formData2.password}
                onChange={handleInputChange2}
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
                onClick={handleCloseEditModal}
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
                onClick={handleUpdateProfile}
                sx={{
                  fontSize: '1rem',
                  padding: '5px 15px',
                  minWidth: '90px',
                }}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default ManageAdmin;
