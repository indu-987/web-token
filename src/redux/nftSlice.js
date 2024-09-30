// src/redux/nftSlice.js

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { ethers } from 'ethers';

const nftSlice = createSlice({
  name: 'nft',
  initialState: {
    minting: false,
    transactionHash: null,
    errorMessage: null,
    cid: null,
    tokenId: null,
  },
  reducers: {
    startMinting: (state) => {
      state.minting = true;
      state.errorMessage = null;
      state.transactionHash = null;
      state.cid = null;
      state.tokenId = null;
    },
    mintSuccess: (state, action) => {
      state.minting = false;
      state.transactionHash = action.payload.transactionHash;
      state.cid = action.payload.cid;
      state.tokenId = action.payload.tokenId;
    },
    mintFailure: (state, action) => {
      state.minting = false;
      state.errorMessage = action.payload;
    },
  },
});

// Actions
export const { startMinting, mintSuccess, mintFailure } = nftSlice.actions;

export const mintNFT = (imageFile) => async (dispatch) => {
  dispatch(startMinting());

  const contractAddress = '0x89d3ebcb24df4c060b27bf39fd0f08e2368b8839';
  const contractABI = [
    {
      constant: false,
      inputs: [
        { name: 'recipient', type: 'address' },
        { name: 'tokenURI', type: 'string' },
      ],
      name: 'mintNFT',
      outputs: [{ name: 'tokenId', type: 'uint256' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ];

  const PINATA_API_KEY = 'a2a4677621b5a2ca4873';
  const PINATA_SECRET_API_KEY = '28b9d8e00bbd21142005278cf56b694dbb73ef89c8ed6a5156d5092202b5e3d3';

  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Upload image to IPFS
    const imageIPFSUrl = await uploadImageToIPFS(imageFile, PINATA_API_KEY, PINATA_SECRET_API_KEY);
    // Upload metadata to IPFS
    const metadataIPFSUrl = await uploadMetadataToIPFS(imageIPFSUrl, PINATA_API_KEY, PINATA_SECRET_API_KEY);

    const recipientAddress = await signer.getAddress();
    const transaction = await contract.mintNFT(recipientAddress, metadataIPFSUrl);
    const receipt = await transaction.wait();
    const newTokenId = receipt.events[0].args.tokenId;

    dispatch(mintSuccess({ transactionHash: transaction.hash, cid: metadataIPFSUrl, tokenId: newTokenId }));
  } catch (error) {
    dispatch(mintFailure(error.message));
  }
};

// Upload image to IPFS
const uploadImageToIPFS = async (file, PINATA_API_KEY, PINATA_SECRET_API_KEY) => {
  const formData = new FormData();
  formData.append('file', file);

  const metadata = JSON.stringify({
    name: 'NFT Image11',
    keyvalues: {
      exampleKey: 'exampleValue',
    },
  });
  formData.append('pinataMetadata', metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', options);

  const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });
  return `https://ipfs.io/ipfs/${res.data.IpfsHash}`;
};

// Upload metadata to IPFS
const uploadMetadataToIPFS = async (imageURL, PINATA_API_KEY, PINATA_SECRET_API_KEY) => {
  const metadata = {
    name: 'My NFT',
    description: 'This is an awesome NFT!',
    image: imageURL,
    attributes: [
      {
        trait_type: 'Coolness',
        value: '100%',
      },
    ],
  };

  const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });
  return res.data.IpfsHash;
};

export default nftSlice.reducer;
