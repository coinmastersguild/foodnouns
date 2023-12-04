import { BigNumber, BigNumberish } from '@ethersproject/bignumber';

export interface BidEvent {
  foodAuction?: boolean;
  nounId: BigNumberish;
  sender: string;
  value: BigNumberish;
  extended: boolean;
  transactionHash: string;
  timestamp: BigNumberish;
}

export interface AuctionCreateEvent {
  foodAuction?: boolean;
  nounId: BigNumberish;
  startTime: BigNumberish;
  endTime: BigNumberish;
  settled: boolean;
}

export interface AuctionSettledEvent {
  foodAuction?: boolean;
  nounId: BigNumberish;
  winner: string;
  amount: BigNumberish;
}

export interface AuctionExtendedEvent {
  foodAuction?: boolean;
  nounId: BigNumberish;
  endTime: BigNumberish;
}

export interface Bid {
  foodAuction?: boolean;
  nounId: BigNumber;
  sender: string;
  value: BigNumber;
  extended: boolean;
  transactionHash: string;
  timestamp: BigNumber;
}
