import React from 'react';
import { META_MASK, WALLET_CONNECT, COINBASE } from '../../utils/constants';
import { Button, Card, Modal } from '@mui/material';
import { useProfile } from '../../contexts/ProfileContext';

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
        <Button onClick={() => connectWallet(META_MASK, handleClose)}>
          Connect with Metamask
        </Button>
        <Button onClick={() => connectWallet(WALLET_CONNECT, handleClose)}>
          Connect with Wallet Connect
        </Button>
        <Button onClick={() => connectWallet(COINBASE, handleClose)}>
          Connect with Coinbase
        </Button>
      </Card>
    </Modal>
  );
}