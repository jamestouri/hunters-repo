import { useState } from 'react';
import { AppBar, Box, Button, Toolbar } from '@mui/material';
import WalletModal from './modals/WalletModal';
import { useProfile } from '../contexts/ProfileContext';
import { walletAddressShortener } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { Logo } from '../utils/images';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { walletAddress } = useProfile();

  return (
    <>
      <WalletModal open={open} handleClose={handleClose} />
      <AppBar
        position='static'
        sx={{ backgroundColor: 'transparent', boxShadow: 'none', marginTop: 2 }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to={'/'} style={{ textDecoration: 'none' }}>
            <Logo />
          </Link>
          <Box display='flex' alignItems='center'>
            {walletAddress ? (
              <Link to={`bounty/new/`} style={{ textDecoration: 'none' }}>
                <Button sx={{ marginRight: 3, padding: 0 }}>
                  Create Bounty
                </Button>
              </Link>
            ) : null}
            {walletAddress ? (
              <Link
                to={`profile/${walletAddress}/`}
                style={{
                  textDecoration: 'none',
                  fontSize: 16,
                  padding: 0,
                  marginLeft: 3,
                  color: '#649ddf',
                }}
              >
                {walletAddressShortener(walletAddress)}
              </Link>
            ) : (
              <Button onClick={handleOpen}>Connect Wallet</Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
