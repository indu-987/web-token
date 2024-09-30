// store.js
import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './walletSlice';
import nftReducer from './nftSlice'
import coinReducer from './coinSlice'
import transferSlice from './transferSlice'
import metadataReducer from './metadataSlice'

const store = configureStore({
  reducer: {
    wallet: walletReducer, 
    nft: nftReducer,
    coin: coinReducer,
    nft: transferSlice,
    metadata: metadataReducer,
  },
});
export default store;
