import React from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import WalletModal from './WalletModal';
import { useProfile } from '../contexts/ProfileContext';
import { walletAddressShortener } from '../utils/helpers';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { walletAddress } = useProfile();

  return (
    <>
      <WalletModal open={open} handleClose={handleClose} />
      <AppBar
        position='static'
        sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography color='black'>Hunters</Typography>
          <Box display='flex' alignItems='center' >
            <Link to={`bounty/new/`} style={{textDecoration: 'none', color: 'red'}}>Create Bounty</Link>
            {walletAddress ? (
              <Typography color='black'>{walletAddressShortener(walletAddress)}</Typography>
            ) : (
              <Button onClick={handleOpen}>Connect Wallet</Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
