import React from 'react';
import {
  useMetamask,
  useWalletConnect,
  useCoinbaseWallet,
} from '@thirdweb-dev/react';
import { Button, Card, Modal } from '@mui/material';

export default function WalletModal({ open, handleClose }) {
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const connectWithCoinbaseWallet = useCoinbaseWallet();

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
        <Button onClick={() => connectWithMetamask()}>
          Connect with Metamask
        </Button>
        <Button onClick={() => connectWithWalletConnect()}>
          Connect with Wallet Connect
        </Button>
        <Button onClick={() => connectWithCoinbaseWallet()}>
          Connect with Coinbase
        </Button>
      </Card>
    </Modal>
  );
}
