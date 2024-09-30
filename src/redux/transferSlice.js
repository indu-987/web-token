// src/redux/transferSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

const transferSlice = createSlice({
  name: 'nft',
  initialState: {
    transactionHash: null,
    errorMessage: null,
    transferring: false,
  },
  reducers: {
    startTransferring: (state) => {
      state.transferring = true;
      state.errorMessage = null;
      state.transactionHash = null;
    },
    transferSuccess: (state, action) => {
      state.transferring = false;
      state.transactionHash = action.payload;
    },
    transferFailure: (state, action) => {
      state.transferring = false;
      state.errorMessage = action.payload;
    },
  },
});

// Actions
export const { startTransferring, transferSuccess, transferFailure } = transferSlice.actions;

// Thunk to transfer NFT
export const transferNFT = (recipientAddress, tokenId) => async (dispatch) => {
  dispatch(startTransferring());

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
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'tokenId', type: 'uint256' }
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];

    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const ownerAddress = await signer.getAddress();
    const transaction = await contract.transferFrom(ownerAddress, recipientAddress, tokenId);
    
    dispatch(transferSuccess(transaction.hash));
    await transaction.wait();
  } catch (error) {
    dispatch(transferFailure(error.message));
  }
};

export default transferSlice.reducer;
