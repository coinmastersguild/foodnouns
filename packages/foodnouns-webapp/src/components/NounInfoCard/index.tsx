import React from 'react';
import { Col } from 'react-bootstrap';

import classes from './NounInfoCard.module.css';

import _AddressIcon from '../../assets/icons/Address.svg';
import _BidsIcon from '../../assets/icons/Bids.svg';

import NounInfoRowBirthday from '../NounInfoRowBirthday';
import NounInfoRowHolder from '../NounInfoRowHolder';
import NounInfoRowButton from '../NounInfoRowButton';
import { useAppSelector } from '../../hooks/reduxHooks';

import config from '../../config';
import { buildEtherscanAddressLink } from '../../utils/etherscan';


interface NounInfoCardProps {
  nounId: number;
  bidHistoryOnClickHandler: () => void;
}

const NounInfoCard: React.FC<NounInfoCardProps> = props => {
  const { nounId, bidHistoryOnClickHandler } = props;

  const etherscanBaseURL = buildEtherscanAddressLink(config.addresses.nounsToken);

  const etherscanButtonClickHandler = () => window.open(`${etherscanBaseURL}/${nounId}`, '_blank');

  const lastAuctionNounId = useAppSelector(state => state.onDisplayFoodNounAuction.lastAuctionFoodNounId);
  console.log("lastAuctionNounId: ", lastAuctionNounId)
    console.log("nounId: ", nounId)
  return (
    <>
      <Col lg={12} className={classes.nounInfoRow}>
        <NounInfoRowBirthday nounId={nounId} />
      </Col>
      <Col lg={12} className={classes.nounInfoRow}>
        <NounInfoRowHolder nounId={nounId} />
      </Col>
      <Col lg={12} className={classes.nounInfoRow}>
        <NounInfoRowButton
          iconImgSource={_BidsIcon}
          btnText={lastAuctionNounId === nounId ? <p>Bids</p> : <p>Bid history</p>}
          onClickHandler={bidHistoryOnClickHandler}
        />
        <NounInfoRowButton
          iconImgSource={_AddressIcon}
          btnText={<p>Etherscan</p>}
          onClickHandler={etherscanButtonClickHandler}
        />
      </Col>
    </>
  );
};

export default NounInfoCard;
