import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

// Import thirdweb provider and Rinkeby ChainId
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { ProfileProvider } from './contexts/ProfileContext';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

// This is the chainId our dApp will work on.
// ChainId is enum with Rinkeby as value 4 and Mainnet value 1
// To look more into it search the ChainId enum in chains.d.ts

const chainId = process.env.REACT_APP_CHAIN_ID;
const activeChainId = Number(chainId);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThirdwebProvider desiredChainId={activeChainId}>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
