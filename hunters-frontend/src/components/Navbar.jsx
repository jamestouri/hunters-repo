import React from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import WalletModal from './WalletModal';
import { useNetwork, useAddress } from '@thirdweb-dev/react';

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <WalletModal open={open} handleClose={handleClose} />
      <AppBar
        position='static'
        sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography color='black'>Hunters</Typography>
          <Box>
            <Button>Create Bounty</Button>
            <Button onClick={handleOpen}>Connect Wallet</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
