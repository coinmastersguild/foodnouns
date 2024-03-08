import { BigNumber } from '@ethersproject/bignumber';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AuctionCreateEvent,
  AuctionExtendedEvent,
  AuctionSettledEvent,
  BidEvent,
} from '../../utils/types';
import { Auction as IAuction } from '../../wrappers/nounsAuction';

export interface FoodNounAuctionState {
  activeFoodNounAuction?: IAuction;
  foodNounBids: BidEvent[];
}

const initialState: FoodNounAuctionState = {
  activeFoodNounAuction: undefined,
  foodNounBids: [],
};

export const reduxSafeNewFoodNounAuction = (auction: AuctionCreateEvent): IAuction => ({
  amount: BigNumber.from(0).toJSON(),
  bidder: '',
  startTime: BigNumber.from(auction.startTime).toJSON(),
  endTime: BigNumber.from(auction.endTime).toJSON(),
  nounId: BigNumber.from(auction.nounId).toJSON(),
  settled: false,
  foodAuction: true,
});

export const reduxSafeFoodNounAuction = (auction: IAuction): IAuction => ({
  amount: BigNumber.from(auction.amount).toJSON(),
  bidder: auction.bidder,
  startTime: BigNumber.from(auction.startTime).toJSON(),
  endTime: BigNumber.from(auction.endTime).toJSON(),
  nounId: BigNumber.from(auction.nounId).toJSON(),
  settled: auction.settled,
  foodAuction: true,
});

export const reduxSafeFoodNounBid = (bid: BidEvent): BidEvent => ({
  nounId: BigNumber.from(bid.nounId).toJSON(),
  sender: bid.sender,
  value: BigNumber.from(bid.value).toJSON(),
  extended: bid.extended,
  transactionHash: bid.transactionHash,
  timestamp: bid.timestamp,
  foodAuction: true
});

const maxFoodNounBid = (bids: BidEvent[]): BidEvent => {
  return bids.reduce((prev, current) => {
    return BigNumber.from(prev.value).gt(BigNumber.from(current.value)) ? prev : current;
  });
};

const auctionsEqual = (
  a: IAuction,
  b: AuctionSettledEvent | AuctionCreateEvent | BidEvent | AuctionExtendedEvent,
) => BigNumber.from(a.nounId).eq(BigNumber.from(b.nounId)) && !!a.foodAuction === !!b.foodAuction;

const containsBid = (bidEvents: BidEvent[], bidEvent: BidEvent) =>
  bidEvents.map(bid => bid.transactionHash).indexOf(bidEvent.transactionHash) >= 0;

/**
 * State of **current** auction (sourced via websocket)
 */
export const foodNounAuctionSlice = createSlice({
  name: 'foodNounAuction',
  initialState,
  reducers: {
    setActiveAuction: (state, action: PayloadAction<AuctionCreateEvent>) => {
        state.activeFoodNounAuction = reduxSafeNewFoodNounAuction(action.payload);
        state.foodNounBids = [];
    },
    setFullAuction: (state, action: PayloadAction<IAuction>) => {
        state.activeFoodNounAuction = reduxSafeFoodNounAuction(action.payload);
    },
    appendBid: (state, action: PayloadAction<BidEvent>) => {
      if (!state.activeFoodNounAuction) return;
        if (containsBid(state.foodNounBids, action.payload)) return;
        state.foodNounBids = [reduxSafeFoodNounBid(action.payload), ...state.foodNounBids];
        const maxBid_ = maxFoodNounBid(state.foodNounBids);
        state.activeFoodNounAuction.amount = BigNumber.from(maxBid_.value).toJSON();
        state.activeFoodNounAuction.bidder = maxBid_.sender;
        console.log('processed bid', action.payload);
    },
    setAuctionSettled: (state, action: PayloadAction<AuctionSettledEvent>) => {
      if (!state.activeFoodNounAuction) return;
      if (auctionsEqual(state.activeFoodNounAuction, action.payload)) {
        state.activeFoodNounAuction.settled = true;
        state.activeFoodNounAuction.bidder = action.payload.winner;
        state.activeFoodNounAuction.amount = BigNumber.from(action.payload.amount).toJSON();
      }
        },
    setAuctionExtended: (state, action: PayloadAction<AuctionExtendedEvent>) => {
      const { activeFoodNounAuction } = state;
      if (!activeFoodNounAuction) return;
      if (auctionsEqual(activeFoodNounAuction, action.payload)) {
        activeFoodNounAuction.endTime = BigNumber.from(action.payload.endTime).toJSON();
      }
      console.log('processed auction extended', action.payload);
    },
  },
});

export const {
  setActiveAuction,
  appendBid,
  setAuctionExtended,
  setAuctionSettled,
  setFullAuction,
} = foodNounAuctionSlice.actions;

export default foodNounAuctionSlice.reducer;
