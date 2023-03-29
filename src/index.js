import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Web3 from "web3";
import {  UseWalletProvider } from 'use-wallet'
import WalletConnectProvider from '@walletconnect/web3-provider';
function getLibrary(provider, connector) {
  return new Web3(provider);
}
const options = new WalletConnectProvider({
  rpc: {
    97: 'https://bsc-dataseed.binance.org/',
  },
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UseWalletProvider
      autoConnect
      chainId={97}
      connectors={{
        // This is how connectors get configured
        walletconnect: options,
        portis: { dAppId: "my-dapp-id-123-xyz" },
      }}
    >
    <App />
    </UseWalletProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
