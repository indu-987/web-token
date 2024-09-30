import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setAccount,
  setErrorMessage,
  setIsConnected,
  setButtonText,
  fetchBalance,
} from '../redux/walletSlice';

export function ConnectWallet() {
  const dispatch = useDispatch();

  // Access wallet state from Redux
  const account = useSelector((state) => state.wallet.account);
  const balance = useSelector((state) => state.wallet.balance);
  const errorMessage = useSelector((state) => state.wallet.errorMessage);
  const buttonText = useSelector((state) => state.wallet.buttonText);

  // Handle wallet connection
  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result) => {
          dispatch(setAccount(result[0]));  // Set the connected account
          dispatch(setIsConnected(true));   // Update connection status
          dispatch(setButtonText('Wallet Connected'));  // Update button text
          dispatch(fetchBalance(result[0])); // When the account is connected
        })
        .catch((error) => {
          dispatch(setErrorMessage(error.message)); // Set any errors
        });
    } else {
      dispatch(setErrorMessage('Please install MetaMask browser extension to interact'));
    }
  };

  // Update account when the wallet account changes
  const accountChangedHandler = (newAccount) => {
    dispatch(setAccount(newAccount));
    dispatch(fetchBalance(newAccount));
  };

  // Reload the page when the chain is changed
  const chainChangedHandler = () => {
    window.location.reload();
  };

  // Set up event listeners for account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', accountChangedHandler);
      window.ethereum.on('chainChanged', chainChangedHandler);

      // Cleanup listeners on component unmount
      return () => {
        window.ethereum.removeListener('accountsChanged', accountChangedHandler);
        window.ethereum.removeListener('chainChanged', chainChangedHandler);
      };
    }
  }, []);

  return (
    <div className="max-w-md mx-auto p-5 bg-white shadow-lg rounded-lg">
      <h4 className="text-lg font-bold mb-4">Connect to MetaMask</h4>
      <button
        onClick={connectWalletHandler}
        className="w-full py-2 mb-4 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition duration-200"
      >
        {buttonText}
      </button>
      <div className="mb-4">
        <h3 className="text-md font-semibold">Address:</h3>
        <p className="text-gray-700">{account || 'Not Connected'}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-md font-semibold">Balance:</h3>
        <p className="text-gray-700">{balance || 'N/A'}</p>
      </div>
      {errorMessage && <div className="text-red-600 mt-2">{errorMessage}</div>}
    </div>
  );
}
