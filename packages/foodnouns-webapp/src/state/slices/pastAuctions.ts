import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuctionState } from './auction';
import { BigNumber } from '@ethersproject/bignumber';

interface PastAuctionsState {
  pastAuctions: AuctionState[];
}

const initialState: PastAuctionsState = {
  pastAuctions: [],
};

const reduxSafePastAuctions = (data: any, nounAuction = false): AuctionState[] => {
  const auctions = data.auctions as any[];
  if (auctions.length < 0) return [];
  const pastAuctions: any = auctions.map(auction => {
    return {
      [nounAuction ? `activeNounAuction` : `activeFoodNounAuction`]: {
        amount: BigNumber.from(auction.amount).toJSON(),
        bidder: auction.bidder ? auction.bidder.id : '',
        startTime: BigNumber.from(auction.startTime).toJSON(),
        endTime: BigNumber.from(auction.endTime).toJSON(),
        nounId: BigNumber.from(auction.id).toJSON(),
        settled: false,
      },
      [nounAuction ? `nounBids` : `foodnounBids`]: auction.bids.map((bid: any) => {
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

const pastAuctionsSlice = createSlice({
  name: 'pastAuctions',
  initialState: initialState,
  reducers: {
    addPastNounAuctions: (state, action: PayloadAction<any>) => {
      state.pastAuctions = state.pastAuctions.concat(reduxSafePastAuctions(action.payload, true))
    },
    addPastFoodNounAuctions: (state, action: PayloadAction<any>) => {
      state.pastAuctions = state.pastAuctions.concat(reduxSafePastAuctions(action.payload))
    },
  },
});

export const { addPastNounAuctions, addPastFoodNounAuctions } = pastAuctionsSlice.actions;

export default pastAuctionsSlice.reducer;
