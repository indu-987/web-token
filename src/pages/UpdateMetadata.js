// src/components/UpdateMetadata.js

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateNFTMetadata } from '../redux/metadataSlice';

export function UpdateMetadata() {
  const dispatch = useDispatch();
  const { transactionHash, errorMessage, updating } = useSelector((state) => state.metadata);
  const [tokenId, setTokenId] = useState('');
  const [newMetadata, setNewMetadata] = useState('');

  const updateMetadataHandler = () => {
    if (!tokenId || !newMetadata) {
      alert('Please enter both token ID and new metadata.');
      return;
    }
    dispatch(updateNFTMetadata(tokenId, newMetadata));
  };

  return (
    <div className="max-w-md mx-auto p-5 bg-white shadow-lg rounded-lg">
      <h4 className="text-lg font-bold mb-4">Update NFT Metadata</h4>

      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
      />

      <input
        type="text"
        placeholder="New Metadata (IPFS URL)"
        value={newMetadata}
        onChange={(e) => setNewMetadata(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
      />

      <button
        onClick={updateMetadataHandler}
        disabled={updating}
        className={`w-full py-2 mb-4 text-white ${updating ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} rounded-md transition duration-200`}
      >
        {updating ? 'Updating...' : 'Update Metadata'}
      </button>

      {transactionHash && (
        <div className="text-green-600">
          <p>Update Successful!</p>
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
