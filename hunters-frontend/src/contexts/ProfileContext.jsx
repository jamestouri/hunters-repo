import { createContext, useContext, useEffect } from 'react';
import {
  useMetamask,
  useWalletConnect,
  useCoinbaseWallet,
  useNetwork,
  useAddress,
} from '@thirdweb-dev/react';
import { META_MASK, WALLET_CONNECT, COINBASE } from '../utils/constants';
import axios from 'axios';

const ProfileContext = createContext({
  walletAddress: null,
  connectWallet: (walletSelected) => {},
});

export function ProfileProvider({ children }) {
  const walletAddress = useAddress();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const connectWithCoinbaseWallet = useCoinbaseWallet();

  const getProfileFromDB = () => {
    if (walletAddress) {
      axios
        .get(`${process.env.REACT_APP_DEV_SERVER}/api/profile/${walletAddress}/`)
        .then((res) => {
          if (res.data) {
            console.log('👤 success', res);
          } else {
            createProfileFromWallet();
          }
        })
        .catch((err) => console.log(err));
    } else {
      return 
    }
  };

  const createProfileFromWallet = () => {
    axios
      .post(`${process.env.REACT_APP_DEV_SERVER}/api/profiles/`, {
        wallet_address: walletAddress,
      })
      .then((res) => console.log('👤 profile successfully created', res))
      .catch((err) => console.log('❗️ ' + err));
  };

  const connectWallet = (walletSelected, handleClose) => {
    switch (walletSelected) {
      case META_MASK:
        connectWithMetamask().then(() => handleClose());
        break;
      case WALLET_CONNECT:
        connectWithWalletConnect().then(() => handleClose());
        break;
      case COINBASE:
        connectWithCoinbaseWallet().then(() => handleClose());
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    getProfileFromDB();
  }, [walletAddress]);

  const ctx = {
    walletAddress,
    connectWallet,
  };

  return (
    <ProfileContext.Provider value={ctx}>{children}</ProfileContext.Provider>
  );
}

export const useProfile = () => {
  return useContext(ProfileContext);
};
