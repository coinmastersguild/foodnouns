import { BigNumber } from '@ethersproject/bignumber';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AuctionCreateEvent,
  AuctionExtendedEvent,
  AuctionSettledEvent,
  BidEvent,
} from '../../utils/types';
import { Auction as IAuction } from '../../wrappers/nounsAuction';

export interface AuctionState {
  activeNounAuction?: IAuction;
  activeFoodNounAuction?: IAuction;
  nounBids: BidEvent[];
  foodnounBids: BidEvent[];
}

const initialState: AuctionState = {
  activeNounAuction: undefined,
  activeFoodNounAuction: undefined,
  nounBids: [],
  foodnounBids: [],
};

export const reduxSafeNewAuction = (auction: AuctionCreateEvent): IAuction => ({
  amount: BigNumber.from(0).toJSON(),
  bidder: '',
  startTime: BigNumber.from(auction.startTime).toJSON(),
  endTime: BigNumber.from(auction.endTime).toJSON(),
  nounId: BigNumber.from(auction.nounId).toJSON(),
  settled: false,
  nounAuction: auction.nounAuction,
});

export const reduxSafeAuction = (auction: IAuction): IAuction => ({
  amount: BigNumber.from(auction.amount).toJSON(),
  bidder: auction.bidder,
  startTime: BigNumber.from(auction.startTime).toJSON(),
  endTime: BigNumber.from(auction.endTime).toJSON(),
  nounId: BigNumber.from(auction.nounId).toJSON(),
  settled: auction.settled,
  nounAuction: auction.nounAuction,
});

export const reduxSafeBid = (bid: BidEvent): BidEvent => ({
  nounId: BigNumber.from(bid.nounId).toJSON(),
  sender: bid.sender,
  value: BigNumber.from(bid.value).toJSON(),
  extended: bid.extended,
  transactionHash: bid.transactionHash,
  timestamp: bid.timestamp,
});

const maxBid = (bids: BidEvent[]): BidEvent => {
  return bids.reduce((prev, current) => {
    return BigNumber.from(prev.value).gt(BigNumber.from(current.value)) ? prev : current;
  });
};

const auctionsEqual = (
  a: IAuction,
  b: AuctionSettledEvent | AuctionCreateEvent | BidEvent | AuctionExtendedEvent,
) => BigNumber.from(a.nounId).eq(BigNumber.from(b.nounId));

const containsBid = (bidEvents: BidEvent[], bidEvent: BidEvent) =>
  bidEvents.map(bid => bid.transactionHash).indexOf(bidEvent.transactionHash) >= 0;

/**
 * State of **current** auction (sourced via websocket)
 */
export const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    setActiveAuction: (state, action: PayloadAction<AuctionCreateEvent>) => {
      if (action.payload.nounAuction) {
        state.activeNounAuction = reduxSafeNewAuction(action.payload);
        state.nounBids = [];
      } else {
        state.activeFoodNounAuction = reduxSafeNewAuction(action.payload);
        state.foodnounBids = [];
      }
      console.log('processed auction create', action.payload);
    },
    setFullAuction: (state, action: PayloadAction<IAuction>) => {
      console.log(`from set full auction: `, action.payload);
      if (action.payload.nounAuction) {
        state.activeNounAuction = reduxSafeAuction(action.payload);
      } else {
        state.activeFoodNounAuction = reduxSafeAuction(action.payload);
      }
    },
    appendBid: (state, action: PayloadAction<BidEvent>) => {
      if (!state.activeNounAuction || !state.activeFoodNounAuction) return;
      if (auctionsEqual(state.activeNounAuction, action.payload)) {
        if (containsBid(state.nounBids, action.payload)) return;
        state.nounBids = [reduxSafeBid(action.payload), ...state.nounBids];
        const maxBid_ = maxBid(state.nounBids);
        state.activeNounAuction.amount = BigNumber.from(maxBid_.value).toJSON();
        state.activeNounAuction.bidder = maxBid_.sender;
        console.log('processed bid', action.payload);
      } else if (auctionsEqual(state.activeFoodNounAuction, action.payload)) {
        if (containsBid(state.foodnounBids, action.payload)) return;
        state.foodnounBids = [reduxSafeBid(action.payload), ...state.foodnounBids];
        const maxBid_ = maxBid(state.foodnounBids);
        state.activeFoodNounAuction.amount = BigNumber.from(maxBid_.value).toJSON();
        state.activeFoodNounAuction.bidder = maxBid_.sender;
        console.log('processed bid', action.payload);
      }
    },
    setAuctionSettled: (state, action: PayloadAction<AuctionSettledEvent>) => {
      if (!state.activeFoodNounAuction || !state.activeNounAuction) return;
      if (auctionsEqual(state.activeFoodNounAuction, action.payload)) {
        state.activeNounAuction.settled = true;
        state.activeNounAuction.bidder = action.payload.winner;
        state.activeNounAuction.amount = BigNumber.from(action.payload.amount).toJSON();
      } else if (auctionsEqual(state.activeNounAuction, action.payload)) {
        state.activeFoodNounAuction.settled = true;
        state.activeFoodNounAuction.bidder = action.payload.winner;
        state.activeFoodNounAuction.amount = BigNumber.from(action.payload.amount).toJSON();
      }
      console.log('processed auction settled', action.payload);
    },
    setAuctionExtended: (state, action: PayloadAction<AuctionExtendedEvent>) => {
      if (!state.activeNounAuction || !state.activeFoodNounAuction) return;
      if (auctionsEqual(state.activeNounAuction, action.payload)) {
        state.activeNounAuction.endTime = BigNumber.from(action.payload.endTime).toJSON();
      } else if (auctionsEqual(state.activeFoodNounAuction, action.payload)) {
        state.activeFoodNounAuction.endTime = BigNumber.from(action.payload.endTime).toJSON();
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
} = auctionSlice.actions;

export default auctionSlice.reducer;