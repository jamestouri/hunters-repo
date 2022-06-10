import { createContext, useEffect, useState } from 'react';
import {
  useMetamask,
  useWalletConnect,
  useCoinbaseWallet,
  useNetwork,
  useAddress,
} from '@thirdweb-dev/react';

export const WalletContext = createContext({
  walletAddress: null,
  connectWallet: (walletSelected) => {},
  bountiesStarted: [],
  bountiesFinished: [],
  bountiesCreated: [],
});

export function WalletProvider({ children }) {
  const walletAddress = useAddress();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const connectWithCoinbaseWallet = useCoinbaseWallet();

  const connectWallet = (walletSelected) => {
    switch (walletSelected) {
      case 'META_MASK':
        connectWithMetamask();
        break;
      case 'WALLET_CONNECT':
        connectWithWalletConnect();
        break;
      case 'COINBASE':
        connectWithCoinbaseWallet();
        break;
      default:
        return;
    }
  };

  useEffect(() => {}, [walletAddress]);

  const ctx = {
    walletAddress,
    connectWallet,
  };

  return (
    <WalletContext.Provider value={ctx}>{children}</WalletContext.Provider>
  );
}
