import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import axios from 'axios';

const DetailAkun = ({ open, user, onClose,onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Untuk indikasi loading

  if (!user) return null; // Jika tidak ada pengguna yang dipilih, jangan render modal

  const handleDeleteClick = () => {
    setConfirmOpen(true); // Buka modal konfirmasi
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true); // Tampilkan loading
      const response = await axios.delete(`http://127.0.0.1:5000/api/pegawai/${user.id}`);
      console.log('Data deleted:', response.data);

      setConfirmOpen(false);
      onClose(); // Tutup modal utama setelah konfirmasi penghapusan
      if (onDelete) onDelete(user.id);
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account');
    } finally {
      setLoading(false); // Sembunyikan loading
    }
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false); // Tutup modal konfirmasi
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box sx={{ position: 'relative', height: '100%' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 5 }}>
              ACCOUNT
            </Typography>
            {[
              { label: "NAME", value: user.name },
              { label: "NIK", value: user.nik },
              { label: "BORN DATE", value: user.born_date },
              { label: "DEPARTMENT", value: user.department },
              { label: "PHONE", value: user.phone_number },
            ].map((item, index) => (
              <Box key={index} sx={{ display: 'flex', mb: 4, alignItems: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', color: 'black', minWidth: '200px' }}
                >
                  {item.label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
                  :
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'normal',
                    color: item.color || 'black',
                    ml: 2,
                    borderBottom: item.underline ? '2px solid green' : 'none'
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 15 }}>
              <Button
                variant="contained"
                onClick={handleDeleteClick} // Memicu modal konfirmasi
                sx={{ mr: 1, backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}
                disabled={loading} // Disabled jika sedang loading
              >
                DELETE
              </Button>
              <Button variant="contained" onClick={onClose}>
                CONFIRM
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Modal Konfirmasi */}
      <Modal open={confirmOpen} onClose={handleCloseConfirm}>
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
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
            ARE YOU SURE YOU WANT TO DELETE THIS ACCOUNT?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleConfirmDelete}
              sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}
              disabled={loading} // Disabled jika sedang loading
            >
              {loading ? 'DELETING...' : 'YES'}
            </Button>
            <Button variant="contained" onClick={handleCloseConfirm}>
              NO
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DetailAkun;
