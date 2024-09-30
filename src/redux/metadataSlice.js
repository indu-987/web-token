// src/redux/metadataSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

const metadataSlice = createSlice({
  name: 'metadata',
  initialState: {
    transactionHash: null,
    errorMessage: null,
    updating: false,
  },
  reducers: {
    startUpdating: (state) => {
      state.updating = true;
      state.errorMessage = null;
      state.transactionHash = null;
    },
    updateSuccess: (state, action) => {
      state.updating = false;
      state.transactionHash = action.payload;
    },
    updateFailure: (state, action) => {
      state.updating = false;
      state.errorMessage = action.payload;
    },
  },
});

// Actions
export const { startUpdating, updateSuccess, updateFailure } = metadataSlice.actions;

// Thunk to update NFT metadata
export const updateNFTMetadata = (tokenId, newMetadata) => async (dispatch) => {
  dispatch(startUpdating());

  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    
    const contractAddress = '0x89d3ebcb24df4c060b27bf39fd0f08e2368b8839';
    const contractABI = [
      {
        constant: false,
        inputs: [
          { name: 'tokenId', type: 'uint256' },
          { name: 'newMetadata', type: 'string' }
        ],
        name: 'updateMetadata',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];

    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const transaction = await contract.updateMetadata(tokenId, newMetadata);
    
    dispatch(updateSuccess(transaction.hash));
    await transaction.wait();
  } catch (error) {
    dispatch(updateFailure(error.message));
  }
};

export default metadataSlice.reducer;
