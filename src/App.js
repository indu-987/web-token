// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';

// Import the components from the components directory
import { ConnectWallet } from './pages/ConnectWallet';
import { SendCoin } from './pages/SendCoin'
import { TransferNFT } from './pages/TransferNFT';
import {UpdateMetadata} from './pages/UpdateMetadata'
import {MintNFT} from './pages/MintNFT';

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-5 h-full">
          <h2 className="text-white text-2xl font-semibold mb-5">Sidebar</h2>
          <ul className="text-white">
            <Link to="/connect-wallet">
              <li className="py-2 cursor-pointer hover:bg-gray-700">Connect Wallet</li>
            </Link>
            <Link to="/mint-nft">
              <li className="py-2 cursor-pointer hover:bg-gray-700">Mint NFT</li>
            </Link>
            <Link to="/send-coin">
              <li className="py-2 cursor-pointer hover:bg-gray-700">Send Coin</li>
            </Link>
            <Link to="/transfer-nft">
              <li className="py-2 cursor-pointer hover:bg-gray-700">Transfer NFT</li>
            </Link>
            <Link to="/update-token-uri">
              <li className="py-2 cursor-pointer hover:bg-gray-700">Update Token URI</li>
            </Link>
          </ul>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <nav className="bg-gray-800 p-4 sticky top-0 z-50">
            <div className="flex items-center justify-between">
              <h1 className="text-white text-xl font-bold">My App</h1>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 bg-gray-100 p-6">
            <Routes>
              <Route path="/connect-wallet" element={<ConnectWallet />} />
              <Route path="/mint-nft" element={<MintNFT />} />
              <Route path="/send-coin" element={<SendCoin />} />
              <Route path="/transfer-nft" element={<TransferNFT />} />
              <Route path="/update-token-uri" element={<UpdateMetadata />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
