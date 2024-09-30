import { createSlice } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

const coinSlice = createSlice({
  name: 'coin',
  initialState: {
    transactionHash: null,
    errorMessage: null,
    sending: false,
  },
  reducers: {
    startSending: (state) => {
      state.sending = true;
      state.errorMessage = null;
      state.transactionHash = null;
    },
    sendSuccess: (state, action) => {
      state.sending = false;
      state.transactionHash = action.payload;
    },
    sendFailure: (state, action) => {
      state.sending = false;
      state.errorMessage = action.payload;
    },
  },
});

export const { startSending, sendSuccess, sendFailure } = coinSlice.actions;

export const sendEther = (recipientAddress, amount) => async (dispatch) => {
  dispatch(startSending());

  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const amountInWei = ethers.parseEther(amount);

    const tx = {
      to: recipientAddress,
      value: amountInWei,
    };

    const transaction = await signer.sendTransaction(tx);
    dispatch(sendSuccess(transaction.hash));

    await transaction.wait();
  } catch (error) {
    dispatch(sendFailure(error.message));
  }
};

export default coinSlice.reducer;
