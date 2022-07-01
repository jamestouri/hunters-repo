import { CardMedia, Modal } from '@mui/material';
import React from 'react';

export default function ImageEnlargeModal({ open, handleClose, imageURL }) {
  return (
    <Modal
      sx={{
        position: 'absolute',
        top: '20%',
        left: '20%',
      }}
      open={open}
      onClose={handleClose}
    >
      <CardMedia
        component='img'
        sx={{ height: 750, width: 750 }}
        image={imageURL}
      />
    </Modal>
  );
}
