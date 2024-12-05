import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText,
  CssBaseline, Box, Typography, Button, Grid, Card, CardContent, Collapse, Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import {
  Dashboard as DashboardIcon, ListAlt, Info, AccountCircle, ExpandLess, ExpandMore,
  Storage, People, Apartment, Search, History, Description
} from '@mui/icons-material';
import logo from './image/logo.png';
import { googleLogout } from '@react-oauth/google';

function Dashboardadmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile || JSON.parse(localStorage.getItem('profile'));
  const [openDataItems, setOpenDataItems] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);

  const handleDataItemsClick = () => {
    setOpenDataItems((prev) => !prev);
  };

  const handleAccountClick = () => {
    setOpenAccount((prev) => !prev);
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

  const recentUsers = [
    { id: 1, name: 'User 1', department: 'IT', status: 'Active' },
    { id: 2, name: 'User 2', department: 'HR', status: 'Inactive' },
    { id: 3, name: 'User 3', department: 'Finance', status: 'Active' },
  ];

  const recentItems = [
    { id: 1, name: 'Redmi Note 9', type: 'Headphone', creationDate: '2024-10-23' },
    // More items can be added here
  ];

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
          p: 2,
          ml: '5px',
          mt: '0px',
          backgroundColor: '#f0f0f0',
          height: '100vh',
        }}
      >
        <Toolbar />
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Box display="flex" flexDirection="column" sx={{ height: '100%' }}>
              <Card sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 5 }}>
                <Storage sx={{ fontSize: 30, marginRight: 2 }} />
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '0.9rem' }}>Items</Typography>
                  <Typography variant="h4" component="div" sx={{ fontSize: '1.5rem' }}>106</Typography>
                </CardContent>
              </Card>

              <Card sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 5 }}>
                <People sx={{ fontSize: 30, marginRight: 2 }} />
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '0.9rem' }}>Users</Typography>
                  <Typography variant="h4" sx={{ fontSize: '1.5rem' }}>106</Typography>
                </CardContent>
              </Card>

              <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Apartment sx={{ fontSize: 30, marginRight: 2 }} />
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '0.9rem' }}>Departments</Typography>
                  <Typography variant="h4" component="div" sx={{ fontSize: '1.5rem' }}>50</Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={8}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 8, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>Recently Added Items</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Date Created</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.creationDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 8 }}>
                  <Typography variant="h6" gutterBottom>Recently Active Users</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentUsers.map((user, index) => (
                        <TableRow key={user.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>{user.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboardadmin;
