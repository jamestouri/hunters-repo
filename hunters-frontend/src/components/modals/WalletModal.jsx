import React from 'react';
import { META_MASK, WALLET_CONNECT, COINBASE } from '../../utils/constants';
import { Button, Card, Modal, Typography } from '@mui/material';
import { useProfile } from '../../contexts/ProfileContext';
import { Coinbase, MetaMask, WalletConnect } from '../../utils/images';

export default function WalletModal({ open, handleClose }) {

  return (
    <Modal
      sx={{
        position: 'absolute',
        top: '20%',
        left: '33%',
      }}
      open={open}
      onClose={handleClose}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: 600,
          width: 550,
          justifyContent: 'center',
        }}
      >
        <MetamaskLogin handleClose={handleClose} />
        <WalletConnectLogin handleClose={handleClose} />
        <CoinbaseLogin handleClose={handleClose} />
      </Card>
    </Modal>
  );
}

function MetamaskLogin({ handleClose }) {
  const { connectWallet } = useProfile();

  return (
    <Button
      sx={{
        color: 'black',
        display: 'flex',
        flexDirection: 'column',
        height: 120,
      }}
      onClick={() => connectWallet(META_MASK, handleClose)}
    >
      <MetaMask />
      <Typography marginTop={2}>Connect with Metamask</Typography>
    </Button>
  );
}

function WalletConnectLogin({ handleClose }) {
  const { connectWallet } = useProfile();

  return (
    <Button
      sx={{
        color: 'black',
        display: 'flex',
        flexDirection: 'column',
        height: 140,
        marginTop: 5,
      }}
      onClick={() => connectWallet(WALLET_CONNECT, handleClose)}
    >
      <WalletConnect />
      <Typography>Connect with Wallet Connect</Typography>
    </Button>
  );
}

function CoinbaseLogin({ handleClose }) {
  const { connectWallet } = useProfile();

  return (
    <Button
      sx={{
        color: 'black',
        display: 'flex',
        flexDirection: 'column',
        height: 140,
        marginTop: 5,
      }}
      onClick={() => connectWallet(COINBASE, handleClose)}
    >
      <Coinbase />
      <Typography marginTop={2}>Connect with Coinbase</Typography>
    </Button>
  );
}
