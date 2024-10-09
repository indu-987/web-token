import React from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'; // Import Navigate
import { useDispatch, useSelector } from 'react-redux';
import { ConnectWallet } from './pages/ConnectWallet';
import { SendCoin } from './pages/SendCoin';
import { TransferNFT } from './pages/TransferNFT';
import { UpdateMetadata } from './pages/UpdateMetadata';
import { MintNFT } from './pages/MintNFT';
import {
  setAccount,
  setErrorMessage,
  setIsConnected,
  setButtonText,
  fetchBalance,
} from './redux/walletSlice';
import './index.css';

function App() {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.wallet.account);
  const balance = useSelector((state) => state.wallet.balance);
  const buttonText = useSelector((state) => state.wallet.buttonText);
  const isConnected = useSelector((state) => state.wallet.isConnected);
  const location = useLocation(); // Get current location

  // Handle wallet connection when button is clicked
  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result) => {
          dispatch(setAccount(result[0]));  // Set the connected account
          dispatch(setIsConnected(true));   // Update connection status
          dispatch(setButtonText('Wallet Connected'));  // Update button text
          dispatch(fetchBalance(result[0])); // Fetch balance when the account is connected
        })
        .catch((error) => {
          dispatch(setErrorMessage(error.message)); // Set any errors
        });
    } else {
      dispatch(setErrorMessage('Please install MetaMask browser extension to interact'));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-gray-900 to-gray-700 p-5 h-full shadow-lg">
        <h2 className="text-white text-2xl font-semibold mb-8">Menu</h2>
        <ul className="text-white">
          <Link to="/mint-nft">
            <li className={`py-3 px-4 mb-4 cursor-pointer ${location.pathname === '/mint-nft' ? 'bg-blue-600' : 'bg-gray-800'} rounded-lg transition duration-300 ease-in-out transform hover:scale-105`}>
              Mint NFT
            </li>
          </Link>
          <Link to="/send-coin">
            <li className={`py-3 px-4 mb-4 cursor-pointer ${location.pathname === '/send-coin' ? 'bg-blue-600' : 'bg-gray-800'} rounded-lg transition duration-300 ease-in-out transform hover:scale-105`}>
              Send Coin
            </li>
          </Link>
          <Link to="/transfer-nft">
            <li className={`py-3 px-4 mb-4 cursor-pointer ${location.pathname === '/transfer-nft' ? 'bg-blue-600' : 'bg-gray-800'} rounded-lg transition duration-300 ease-in-out transform hover:scale-105`}>
              Transfer NFT
            </li>
          </Link>
          <Link to="/update-token-uri">
            <li className={`py-3 px-4 mb-4 cursor-pointer ${location.pathname === '/update-token-uri' ? 'bg-blue-600' : 'bg-gray-800'} rounded-lg transition duration-300 ease-in-out transform hover:scale-105`}>
              Update Token URI
            </li>
          </Link>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-gray-900 p-5 sticky top-0 z-50 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-white text-2xl font-bold">My NFT App</h1>
          </div>
          <div className="flex items-center">
            {isConnected && (
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2" />
            )}
            <button
              onClick={connectWalletHandler}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all transform duration-300 hover:scale-105"
            >
              {account ? `${balance ? balance.slice(0, 5) : 'Loading...'} ETH` : buttonText}
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 flex items-center justify-center p-6 bg-gray-100">
          <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg">
            <Routes>
              <Route path="/connect-wallet" element={<ConnectWallet />} />
              <Route path="/mint-nft" element={<MintNFT />} />
              <Route path="/send-coin" element={<SendCoin />} />
              <Route path="/transfer-nft" element={<TransferNFT />} />
              <Route path="/update-token-uri" element={<UpdateMetadata />} />
              <Route path="*" element={<Navigate to="/mint-nft" replace />} /> {/* Redirect to /mint-nft */}
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
