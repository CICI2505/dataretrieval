import React from 'react';
import { Box, Typography, Button } from '@mui/material'; // Pastikan Anda mengimpor komponen yang diperlukan dari MUI

function EditProfile({ profile, handleOpenEditModal }) {
  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 5 }}>
        ACCOUNT
      </Typography>
      {[
        { label: "NAME", value: profile.name },
        { label: "NIK", value: profile.nik },
        { label: "BORN DATE", value: profile.born_date },
        { label: "DEPARTMENT", value: profile.department },
        { label: "PHONE", value: profile.phone_number },
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
      <Box sx={{ position: 'absolute', bottom: 0, right: 0 }}>
        <Button onClick={handleOpenEditModal} variant="contained">
          Edit
        </Button>
      </Box>
    </Box>
  );
}

export default EditProfile;
