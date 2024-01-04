import {  configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/application';
import accountReducer from './slices/account';
import auctionReducer from './slices/auction';
import logsReducer from './slices/logs';
import pastAuctionsReducer from './slices/pastAuctions';
import onDisplayNounAuctionReducer from './slices/onDisplayNounAuction';
import onDisplayFoodNounAuctionReducer from './slices/onDisplayFoodNounAuction';


const store = configureStore({
  reducer: {
    application: appReducer,
    account: accountReducer,
    auction: auctionReducer,
    logs: logsReducer,
    pastAuctions: pastAuctionsReducer,
    onDisplayNounAuction: onDisplayNounAuctionReducer,
    onDisplayFoodNounAuction: onDisplayFoodNounAuctionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
