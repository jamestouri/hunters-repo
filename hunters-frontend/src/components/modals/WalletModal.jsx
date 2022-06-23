import React from 'react';
import { META_MASK, WALLET_CONNECT, COINBASE } from '../../utils/constants';
import { Box, Button, Card, Modal } from '@mui/material';
import { useProfile } from '../../contexts/ProfileContext';
import { Coinbase, MetaMask, WalletConnect } from '../../utils/images';


export default function WalletModal({ open, handleClose }) {
  const { connectWallet } = useProfile();

  return (
    <Modal
      sx={{
        position: 'absolute',
        top: '33%',
        left: '33%',
      }}
      open={open}
      onClose={handleClose}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          height: 400,
          width: 550,
          justifyContent: 'center',
        }}
      >
        <MetaMask />
        <Button sx={{color: 'black'}} onClick={() => connectWallet(META_MASK, handleClose)}>
          Connect with Metamask
        </Button>
        <WalletConnectLogin handleClose={handleClose} />
        <CoinbaseLogin handleClose={handleClose} />
      </Card>
    </Modal>
  );
}


function WalletConnectLogin({handleClose}) {
  const {connectWallet} = useProfile();

  return (
    <Box display='flex' flexDirection='column' justifyContent='center'>
    <WalletConnect />
    <Button sx={{color: 'black'}} onClick={() => connectWallet(WALLET_CONNECT, handleClose)}>
        Connect with Wallet Connect
      </Button>
  </Box>
  )
}

function CoinbaseLogin({handleClose}) {
  const { connectWallet } = useProfile();

  return (
    <Box display='flex' flexDirection='column' justifyContent='center'>
      <Coinbase />
      <Button sx={{color: 'black'}} onClick={() => connectWallet(COINBASE, handleClose)}>
          Connect with Coinbase
        </Button>
    </Box>
  )
}

