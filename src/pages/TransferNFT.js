// src/components/TransferNFT.js

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { transferNFT } from '../redux/transferSlice';

export function TransferNFT() {
  const dispatch = useDispatch();
  const { transactionHash, errorMessage, transferring } = useSelector((state) => state.nft);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [tokenId, setTokenId] = useState('');

  const transferNFTHandler = () => {
    if (!recipientAddress || !tokenId) {
      alert('Please enter both recipient address and token ID.');
      return;
    }
    dispatch(transferNFT(recipientAddress, tokenId));
  };

  return (
    <div className="max-w-md mx-auto p-5 bg-white shadow-lg rounded-lg">
      <h4 className="text-lg font-bold mb-4">Transfer NFT</h4>

      <input
        type="text"
        placeholder="Recipient Address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
      />

      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
      />

      <button
        onClick={transferNFTHandler}
        disabled={transferring}
        className={`w-full py-2 mb-4 text-white ${transferring ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} rounded-md transition duration-200`}
      >
        {transferring ? 'Transferring...' : 'Transfer NFT'}
      </button>

      {transactionHash && (
        <div className="text-green-600">
          <p>Transfer Successful!</p>
          <p>
            Transaction Hash: 
            <a
              href={`https://etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              {transactionHash}
            </a>
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="text-red-400 mt-2">
          <p>Error: {errorMessage}</p>
        </div>
      )}
    </div>
  );
}
 