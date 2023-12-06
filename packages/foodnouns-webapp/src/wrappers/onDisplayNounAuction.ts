import { BigNumber } from '@ethersproject/bignumber';
import { useAppSelector } from '../hooks';
import { generateEmptyNounderAuction, isNounderNoun } from '../utils/nounderNoun';
import { Bid, BidEvent } from '../utils/types';
import { Auction } from './nounsAuction';

const deserializeAuction = (reduxSafeAuction: Auction): Auction => {
  return {
    amount: BigNumber.from(reduxSafeAuction.amount),
    bidder: reduxSafeAuction.bidder,
    startTime: BigNumber.from(reduxSafeAuction.startTime),
    endTime: BigNumber.from(reduxSafeAuction.endTime),
    nounId: BigNumber.from(reduxSafeAuction.nounId),
    settled: false,
    nounAuction: true,
  };
};

const deserializeBid = (reduxSafeBid: BidEvent): Bid => {
  return {
    nounId: BigNumber.from(reduxSafeBid.nounId),
    sender: reduxSafeBid.sender,
    value: BigNumber.from(reduxSafeBid.value),
    extended: reduxSafeBid.extended,
    transactionHash: reduxSafeBid.transactionHash,
    timestamp: BigNumber.from(reduxSafeBid.timestamp),
  };
};
const deserializeBids = (reduxSafeBids: BidEvent[]): Bid[] => {
  return reduxSafeBids
    .map(bid => deserializeBid(bid))
    .sort((a: Bid, b: Bid) => {
      return b.timestamp.toNumber() - a.timestamp.toNumber();
    });
};

const useOnDisplayNounAuction = (): Auction | undefined => {
  const lastAuctionNounId = useAppSelector(state => state.auction.activeNounAuction?.nounId);
  const onDisplayAuctionNounId = useAppSelector(
    state => state.onDisplayNounAuction.onDisplayAuctionNounId,
  );
  const currentAuction = useAppSelector(state => state.auction.activeNounAuction);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  if (
    onDisplayAuctionNounId === undefined ||
    lastAuctionNounId === undefined ||
    currentAuction === undefined ||
    !pastAuctions
  )
    return undefined;

  // current auction
  if (BigNumber.from(onDisplayAuctionNounId).eq(lastAuctionNounId)) {
    return deserializeAuction(currentAuction);
  }

  // nounder auction
  if (isNounderNoun(BigNumber.from(onDisplayAuctionNounId))) {
    const emptyNounderAuction = generateEmptyNounderAuction(
      BigNumber.from(onDisplayAuctionNounId),
      pastAuctions,
    );

    return deserializeAuction(emptyNounderAuction);
  }

  // past auction
  const reduxSafeAuction: Auction | undefined = pastAuctions.find(auction => {
    const nounId = auction.activeNounAuction && BigNumber.from(auction.activeNounAuction.nounId);
    return nounId && nounId.toNumber() === onDisplayAuctionNounId;
  })?.activeNounAuction;

  return reduxSafeAuction ? deserializeAuction(reduxSafeAuction) : undefined;
};

export const useNounAuctionBids = (auctionNounId: BigNumber): Bid[] | undefined => {
  const lastAuctionNounId = useAppSelector(state => state.onDisplayNounAuction.lastAuctionNounId);
  const lastAuctionBids = useAppSelector(state => state.auction.nounBids);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  // auction requested is active auction
  if (lastAuctionNounId === auctionNounId.toNumber()) {
    return deserializeBids(lastAuctionBids);
  } else {
    // find bids for past auction requested
    const bidEvents: BidEvent[] | undefined = pastAuctions.find(auction => {
      const nounId = auction.activeNounAuction && BigNumber.from(auction.activeNounAuction.nounId);
      return nounId && nounId.eq(auctionNounId);
    })?.nounBids;

    return bidEvents && deserializeBids(bidEvents);
  }
};



export default useOnDisplayNounAuction;
