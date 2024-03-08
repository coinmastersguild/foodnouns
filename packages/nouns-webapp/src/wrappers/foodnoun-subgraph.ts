import { gql } from '@apollo/client';
import { BigNumberish } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

export interface IBid {
  id: string;
  bidder: {
    id: string;
  };
  amount: BigNumber;
  blockNumber: number;
  blockTimestamp: number;
  txIndex?: number;
  noun: {
    id: number;
    startTime?: BigNumberish;
    endTime?: BigNumberish;
    settled?: boolean;
  };
}

interface ProposalVote {
  supportDetailed: 0 | 1 | 2;
  voter: {
    id: string;
  };
}

export interface ProposalVotes {
  votes: ProposalVote[];
}

export interface Delegate {
  id: string;
  nounsRepresented: {
    id: string;
  }[];
}

export interface Delegates {
  delegates: Delegate[];
}

export const seedsQuery = (first = 100) => gql`
{
  seeds(first: ${first}) {
    id
    background
    body
    accessory
    head
    glasses
  }
}
`;

export const proposalsQuery = (first = 100) => gql`
{
  proposals(first: ${first}, orderBy: createdBlock, orderDirection: asc) {
    id
    description
    status
    proposalThreshold
    quorumVotes
    forVotes
    againstVotes
    abstainVotes
    createdTransactionHash
    createdBlock
    startBlock
    endBlock
    executionETA
    targets
    values
    signatures
    calldatas
    proposer {
      id
    }
  }
}
`;

export const auctionQuery = (auctionId: number) => gql`
{
	auction(id: ${auctionId}) {
	  id
	  amount
	  settled
	  bidder {
	  	id
	  }
	  startTime
	  endTime
	  noun {
		 id
		  seed {
		   id
		   background
		   body
		   accessory
		   head
		   glasses
		}
		owner {
		  id
		}
	  }
	  bids {
      id
      blockNumber
      txIndex
      amount
	  }
	}
}
`;

export const bidsByAuctionQuery = (auctionId: string) => gql`
 {
	bids(where:{auction: "${auctionId}"}) {
	  id
	  amount
	  blockNumber
	  blockTimestamp
	  txIndex
	  bidder {
	  	id
	  }
	  noun {
		id
	  }
	}
  }
 `;

export const nounQuery = (id: string) => gql`
 {
	noun(id:"${id}") {
	  id
	  seed {
	  background
		body
		accessory
		head
		glasses
	}
	  owner {
		id
	  }
	}
  }
 `;

export const nounsIndex = () => gql`
  {
    nouns {
      id
      owner {
        id
      }
    }
  }
`;

export const latestAuctionsQuery = () => gql`
  {
    auctions(orderBy: startTime, orderDirection: desc, first: 100) {
      id
      amount
      settled
      bidder {
        id
      }
      startTime
      endTime
      noun {
        id
        owner {
          id
        }
      }
      bids {
        id
        amount
        blockNumber
        blockTimestamp
        txIndex
        bidder {
          id
        }
      }
    }
  }
`;

export const latestBidsQuery = (first: number = 5) => gql`
{
	bids(
	  first: ${first},
	  orderBy:blockTimestamp,
	  orderDirection: desc
	) {
	  id
	  bidder {
		id
	  }
	  amount
	  blockTimestamp
	  txIndex
	  blockNumber
	  auction {
		id
		startTime
		endTime
		settled
	  }
	}
  }  
`;

export const nounVotingHistoryQuery = (nounId: number, first = 100) => gql`
{
	noun(id: ${nounId}) {
		id
		votes(first: ${first}) {
      blockNumber
      proposal {
        id
      }
      support
      supportDetailed
      voter {
        id
      }
		}
	}
}
`;

export const createTimestampAllProposals = () => gql`
  {
    proposals(orderBy: createdTimestamp, orderDirection: asc, first: 100) {
      id
      createdTimestamp
    }
  }
`;

export const proposalVotesQuery = (proposalId: string) => gql`
  {
    votes(where: { proposal: "${proposalId}", votesRaw_gt: 0 }) {
      supportDetailed
      voter {
        id
      }

    }	
  }
`;

export const delegateNounsAtBlockQuery = (delegates: string[], block: number) => gql`
{
  delegates(where: { id_in: ${JSON.stringify(delegates)} }, block: { number: ${block} }) {
    id
    nounsRepresented {
      id
    }
  }
}
`;

export const currentlyDelegatedNouns = (delegate: string) => gql`
{
  delegates(where: { id: "${delegate}"} ) {
    id
    nounsRepresented {
      id
    }
  }
}
`;

export const totalBid = () => gql`
  {
    governances {
      id
      totalBid
    }
  }
`;

export const leaderboard = (tops: number) => gql`
  {
    delegates(first: ${tops}, orderBy: delegatedVotes, orderDirection: desc, where: { delegatedVotes_gt:0 }) {
      id
      delegatedVotes
      votes {
        id
      }
    }
    auctions(orderBy: startTime, orderDirection: desc, first: 1) {
      id
      amount
      startTime
      endTime
      noun {
        id
      }
    }
  }
`;

export const settlements = (tops: number) => gql`
  {
    accounts(first: ${tops},orderBy: totalSettlementFee, orderDirection: desc,where: { settlementCount_gt:0 }) {
      id
      settlementCount
      totalSettlementFee
    }
    governances {
      totalSettlementFee
    }
  }
`;

export const mintedHeads = () => gql`
  {
    seeds {
      id
      head
    }
  }
`;
