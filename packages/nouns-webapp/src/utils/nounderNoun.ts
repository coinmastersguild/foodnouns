import { Auction } from '../wrappers/nounsAuction';
import { AuctionsState } from '../state/slices/nounAuction';
import { BigNumber } from '@ethersproject/bignumber';

export const isNounderNoun = (nounId: BigNumber) => {
  return nounId.mod(10).eq(0) || nounId.eq(0) || nounId.mod(10).eq(1) || nounId.eq(1);
};

const emptyNounderAuction = (onDisplayAuctionId: number): Auction => {
  return {
    amount: BigNumber.from(0).toJSON(),
    bidder: '',
    startTime: BigNumber.from(0).toJSON(),
    endTime: BigNumber.from(0).toJSON(),
    nounId: BigNumber.from(onDisplayAuctionId).toJSON(),
    settled: false,
    foodAuction: false
  };
};

const findAuction = (id: BigNumber, auctions: AuctionsState[]): Auction | undefined => {
  let auction = auctions.find(auction => {
    if (!auction.activeAuction) return undefined;
    return BigNumber.from(auction.activeAuction?.nounId).eq(id);
  })?.activeAuction;
  if (!auction) {
    auction = auctions.find(auction => {
      if (!auction.activeAuction) return undefined;
      return BigNumber.from(auction.activeAuction?.nounId).eq(id);
    })?.activeAuction;
  }
  return auction
};

/**
 *
 * @param nounId
 * @param pastAuctions
 * @returns empty `Auction` object with `startTime` set to auction after param `nounId`
 */
export const generateEmptyNounderAuction = (
  nounId: BigNumber,
  pastAuctions: AuctionsState[],
): Auction => {
  const nounderAuction = emptyNounderAuction(nounId.toNumber());
  // use nounderAuction.nounId + 1 to get mint time
  const auctionAbove = findAuction(nounId.add(1), pastAuctions);
  const auctionAboveStartTime = auctionAbove && BigNumber.from(auctionAbove.startTime);
  if (auctionAboveStartTime) nounderAuction.startTime = auctionAboveStartTime.toJSON();

  return nounderAuction;
};
