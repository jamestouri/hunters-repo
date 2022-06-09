import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
} from '@mui/material';


export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar
        position='fixed'
        sx={{ backgroundColor: 'transparent', boxShadow: 'none'}}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Hunters</Typography>
          <Box>
            <Button>Create Bounty</Button>
            <Button>Connect Wallet</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
