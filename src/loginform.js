import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import logo from "./image/logo.png";

function Login() {
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah perilaku default dari form

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/login", {
        nik,
        password,
      });

      console.log("API Response:", response.data); // Log untuk debugging

      if (response.data.status === "success") {
        const { profile } = response.data;
        console.log("Profile data:", profile); // Untuk memastikan struktur data profil

        // Pastikan profile ada
        if (profile) {
          const { user_id, role } = profile;
          console.log("User Role:", role); // Debugging: cek nilai role

          // Simpan data di localStorage
          localStorage.setItem("userId", user_id);
          localStorage.setItem("role", role);
          localStorage.setItem("profile", JSON.stringify(profile)); 

          setOpenSuccessModal(true);

          // Navigasi berdasarkan role
          if (role === "admin") {
            localStorage.setItem("isAdminLoggedIn", "true");
            navigate("/dashboardadmin"); // Arahkan ke dashboard admin
          } else if (role === "pegawai") {
            navigate("/dashboarduser"); // Arahkan ke dashboard user
          } else {
            setError("Role tidak dikenali.");
            setOpenErrorModal(true);
          }
        } else {
          setError("Profile tidak ditemukan.");
          setOpenErrorModal(true);
        }
      } else {
        setError(response.data.message || "Login gagal.");
        setOpenErrorModal(true);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setOpenErrorModal(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
    setError("");
  };

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "95%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "40%", textAlign: "center", mr: 5 }}>
          <img src={logo} alt="PT Sat Nusapersada" width={250} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            PT SAT NUSAPERSADA Tbk
          </Typography>
          <Typography variant="subtitle1">
            High Technology Electronics Manufacturers
          </Typography>
        </Box>

        <Box sx={{ width: "50%" }}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            WELCOME
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            "Please enter your identity"
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="NIK"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            {error && <Typography color="error">{error}</Typography>}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button fullWidth variant="outlined" color="error" type="submit">
                Login
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Dialog open={openSuccessModal} onClose={handleCloseSuccessModal}>
        <DialogContent sx={{ textAlign: "center" }}>
          <IconButton>
            <CheckCircle color="success" sx={{ fontSize: 50 }} />
          </IconButton>
          <Typography>Login berhasil!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessModal} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openErrorModal} onClose={handleCloseErrorModal}>
        <DialogContent sx={{ textAlign: "center" }}>
          <IconButton>
            <Cancel color="error" sx={{ fontSize: 50 }} />
          </IconButton>
          <Typography>{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorModal} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Login;