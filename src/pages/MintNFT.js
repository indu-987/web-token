import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mintNFT } from '../redux/nftSlice';

export function MintNFT() {
  const dispatch = useDispatch();
  const { minting, transactionHash, errorMessage, cid, tokenId } = useSelector((state) => state.nft);
  
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      setImageFile(null);
      return;
    }
    setImageFile(file);
  };

  const mintNFTHandler = () => {
    if (!imageFile || !name || !description) {
      alert('Please upload an image, and enter a name and description.');
      return;
    }
    dispatch(mintNFT(imageFile, name, description)); // Pass the name and description to the mintNFT action
  };

  const copyCidToClipboard = () => {
    if (cid) {
      navigator.clipboard.writeText(cid);
      alert('CID copied to clipboard');
    }
  };

  return (
    <div className="max-w-md mx-auto p-5 bg-white shadow-lg rounded-lg">
      <h4 className="text-lg font-bold mb-4">Mint NFT</h4>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={mintNFTHandler}
        disabled={minting}
        className={`w-full py-2 mb-4 text-white ${minting ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} rounded-md transition duration-200`}
      >
        {minting ? 'Minting...' : 'Mint NFT'}
      </button>

      {transactionHash && (
        <div className="text-green-600">
          <p>Transaction Successful!</p>
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

      {cid && (
        <div className="text-green-600 mt-4">
          <p>CID: {cid}</p>
          <a
            href={`https://ipfs.io/ipfs/${cid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            View on IPFS
          </a>
          <button
            onClick={copyCidToClipboard}
            className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded mt-2"
          >
            Copy CID to Clipboard
          </button>
        </div>
      )}

      {tokenId && (
        <div className="text-blue-600 mt-4">
          <p>Token ID: {tokenId.toString()}</p>
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
