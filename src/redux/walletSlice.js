import { createSlice } from '@reduxjs/toolkit';
import { ethers } from 'ethers'; // Import ethers.js directly

// Initial state
const initialState = {
  account: null,
  balance: null,
  isConnected: false,
  buttonText: 'Connect Wallet',
  errorMessage: null,
};

// Redux slice
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setButtonText: (state, action) => {
      state.buttonText = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
  },
});

// Action creators
export const { setAccount, setBalance, setIsConnected, setButtonText, setErrorMessage } = walletSlice.actions;

// Thunk to fetch balance
export const fetchBalance = (account) => async (dispatch) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum); // Connect to MetaMask
    const balance = await provider.getBalance(account); // Get balance in Wei
    const balanceInEther = ethers.formatEther(balance); // Convert Wei to Ether

    dispatch(setBalance(`${balanceInEther} ETH`));
  } catch (error) {
    dispatch(setErrorMessage('Failed to fetch balance'));
  }
};

export default walletSlice.reducer;
