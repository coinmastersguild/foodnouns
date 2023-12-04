import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NounAuctionState } from './nounAuction';
import { BigNumber } from '@ethersproject/bignumber';
import { Auction as IAuction } from "../../wrappers/nounsAuction";
import { BidEvent } from "../../utils/types";

// export interface AuctionState {
//   activeNounAuction?: IAuction;
//   activeFoodNounAuction?: IAuction;
//   nounBids: BidEvent[];
//   foodNounBids: BidEvent[];
// }

interface PastAuctionsState {
  pastNounAuctions: NounAuctionState[];
  pastFoodAuctions: NounAuctionState[];
}

const initialState: PastAuctionsState = {
  pastNounAuctions: [],
  pastFoodAuctions: [],
};

const reduxSafePastAuctions = (data: any, foodAuction = true): NounAuctionState[] => {
  const { pastNounAuctions, pastFoodAuctions } = data;
  const pastAuctions = foodAuction ? pastFoodAuctions : pastNounAuctions;
  if (pastAuctions.length < 0) return [];
  const pastNounAuctions: any = pastAuctions.map((auction: any) => {
    return {
      [foodAuction ? `activeFoodNounAuction` : `activeNounAuction`]: {
        amount: BigNumber.from(auction.amount).toJSON(),
        bidder: auction.bidder ? auction.bidder.id : '',
        startTime: BigNumber.from(auction.startTime).toJSON(),
        endTime: BigNumber.from(auction.endTime).toJSON(),
        nounId: BigNumber.from(auction.id).toJSON(),
        settled: false,
      },
      [foodAuction ? `foodNounBids` : `nounBids`]: auction.bids.map((bid: any) => {
        return {
          nounId: BigNumber.from(auction.id).toJSON(),
          sender: bid.bidder.id,
          value: BigNumber.from(bid.amount).toJSON(),
          extended: false,
          transactionHash: bid.id,
          transactionIndex: Number(bid.txIndex),
          timestamp: BigNumber.from(bid.blockTimestamp).toJSON(),
        };
      }),
    };
  });
  return pastAuctions;
};

const pastFoodNounAuctionsSlice = createSlice({
  name: 'pastFoodNounAuctions',
  initialState: initialState,
  reducers: {
    addPastFoodNounAuctions: (state, action: PayloadAction<any>) => {
      state.pastFoodNounAuctions = state.pastFoodNounAuctions.concat(reduxSafePastAuctions(action.payload, true))
    },
  },
});

const pastNounAuctionsSlice = createSlice({
  name: 'pastNounAuctions',
  initialState: initialState,
  reducers: {
    addPastNounAuctions: (state, action: PayloadAction<any>) => {
      state.pastNounAuctions = state.pastNounAuctions.concat(reduxSafePastAuctions(action.payload, false))
    },
  },
});

export const { addPastNounAuctions, addPastFoodNounAuctions } = pastAuctionsSlice.actions;

export default pastAuctionsSlice.reducer;
