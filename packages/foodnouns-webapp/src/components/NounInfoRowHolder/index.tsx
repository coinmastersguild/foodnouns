import { useQuery } from '@apollo/client';
import React from 'react';
import { Image } from 'react-bootstrap';
import _LinkIcon from '../../assets/icons/Link.svg';
import { auctionQuery } from '../../wrappers/subgraph';
import _HeartIcon from '../../assets/icons/Heart.svg';
import classes from './NounInfoRowHolder.module.css';

import config from '../../config';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import ShortAddress from '../ShortAddress';

import { useAppSelector } from '../../hooks/reduxHooks';


interface NounInfoRowHolderProps {
  nounId: number;
}

const NounInfoRowHolder: React.FC<NounInfoRowHolderProps> = props => {
  const { nounId } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const { loading, error, data } = useQuery(auctionQuery(nounId));

  const winner = data && data.auction && data.auction.bidder?.id;

  if (loading || !winner) {
    return (
      <div className={classes.nounHolderInfoContainer}>
        <span className={classes.nounHolderLoading}>
          <p>Loading...</p>
        </span>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <p>Failed to fetch Noun info</p>
      </div>
    );
  }

  const etherscanURL = buildEtherscanAddressLink(winner);
  const shortAddressComponent = <ShortAddress address={winner} />;

  return (
    <div className={classes.nounHolderInfoContainer}>
      <span>
        <Image src={_HeartIcon} className={classes.heartIcon} />
      </span>
      <span>
        <p>Winner</p>
      </span>
      <span>
        <a
          className={
            isCool ? classes.nounHolderEtherscanLinkCool : classes.nounHolderEtherscanLinkWarm
          }
          href={etherscanURL}
          target={'_blank'}
          rel="noreferrer"
        >
          {winner.toLowerCase() === config.addresses.nounsAuctionHouseProxy.toLowerCase() ? (
            <p>Nouns Auction House</p>
          ) : (
            shortAddressComponent
          )}
        </a>
      </span>
      <span className={classes.linkIconSpan}>
        <Image src={_LinkIcon} className={classes.linkIcon} />
      </span>
    </div>
  );
};

export default NounInfoRowHolder;
