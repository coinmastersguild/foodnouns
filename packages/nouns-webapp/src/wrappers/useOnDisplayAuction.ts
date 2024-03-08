import { useAppSelector } from '../hooks';
import { generateEmptyNounderAuction, isNounderNoun } from '../utils/nounderNoun';
import { Bid, BidEvent } from '../utils/types';
import { Auction } from './nounsAuction';
import { BigNumber } from "ethers";

const deserializeAuction = (reduxSafeAuction: Auction): Auction => {

  return {
    amount: BigNumber.from(reduxSafeAuction.amount),
    bidder: reduxSafeAuction.bidder,
    startTime: BigNumber.from(reduxSafeAuction.startTime),
    endTime: BigNumber.from(reduxSafeAuction.endTime),
    nounId: BigNumber.from(reduxSafeAuction.nounId),
    settled: false,
    foodAuction: true,
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

const useOnDisplayAuction = (): Auction | undefined => {
  const lastAuctionNounId = useAppSelector(state => state.onDisplayNounAuction?.lastAuctionNounId);
  const onDisplayAuctionNounId = useAppSelector(
    state => state.onDisplayNounAuction.onDisplayAuctionNounId,
  );
  const currentAuction = useAppSelector(state => state.auction.);
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
    const nounId = auction.activeAuction && BigNumber.from(auction.activeAuction.nounId);
    return nounId && nounId.toNumber() === onDisplayAuctionNounId;
  })?.activeAuction;

  return reduxSafeAuction ? deserializeAuction(reduxSafeAuction) : undefined;
};

export const useNounAuctionBids = (auction: IAuction | undefined): Bid[] | undefined => {
  const isFoodAuction = !!auction?.foodAuction;

  const lastAuctionNounId = useAppSelector(state => state.onDisplayNounAuction.lastAuctionNounId);
  const lastAuctionBids = useAppSelector(state => state.auction.nounBids);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  // auction requested is active auction
  if (lastAuctionNounId === auction.nounId.toNumber()) {
    return deserializeBids(lastAuctionBids);
  } else {
    // find bids for past auction requested
    const bidEvents: BidEvent[] | undefined = pastAuctions.find(auction => {
      const nounId = auction.activeNounAuction && BigNumber.from(auction.activeNounAuction.nounId);
      return nounId && nounId.eq(lastAuctionNounId);
    })?.nounBids;

    return bidEvents && deserializeBids(bidEvents);
  }
};

export default useOnDisplayAuction;