import { useEffect, useState, useRef, ChangeEvent, useCallback, FC, RefObject } from 'react';
import { Auction, AuctionHouseContractFunction } from '../../wrappers/nounsAuction';
import { useContractFunction } from '@usedapp/core';
import { connectContractToSigner } from '@usedapp/core/dist/cjs/src/hooks';
import { useAppSelector } from '../../hooks/reduxHooks';
import { utils, BigNumber as EthersBN } from 'ethers';
import BigNumber from 'bignumber.js';
import classes from './Bid.module.css';
import { Spinner, InputGroup, FormControl, Button, Col } from 'react-bootstrap';
import { useAuctionMinBidIncPercentage } from '../../wrappers/nounsAuction';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import { NounsAuctionHouseFactory } from '@foodnouns/sdk';
import config from '../../config';
import WalletConnectModal from '../WalletConnectModal';
import SettleManuallyBtn from '../SettleManuallyBtn';

import { useActiveLocale } from '../../hooks/useActivateLocale';
import responsiveUiUtilsClasses from '../../utils/ResponsiveUIUtils.module.css';

const computeMinimumNextBid = (
  currentBid: BigNumber,
  minBidIncPercentage: BigNumber | undefined,
): BigNumber => {
  if (!minBidIncPercentage) {
    return new BigNumber(0);
  }
  return currentBid
    .times(minBidIncPercentage.div(100).plus(1))
    .decimalPlaces(0, BigNumber.ROUND_UP);
};

const minBidEth = (minBid: BigNumber): string => {
  if (minBid.isZero()) {
    return '0.01';
  }

  const eth = utils.formatEther(EthersBN.from(minBid.toString()));
  return new BigNumber(eth).toFixed(2, BigNumber.ROUND_CEIL);
};

const currentBid = (bidInputRef: RefObject<HTMLInputElement>) => {
  if (!bidInputRef.current || !bidInputRef.current.value) {
    return new BigNumber(0);
  }
  return new BigNumber(utils.parseEther(bidInputRef.current.value).toString());
};

const Bid: FC<{
  auction: Auction;
  auctionEnded: boolean;
}> = props => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { auction, auctionEnded } = props;
  const activeLocale = useActiveLocale();
  const nounsAuctionHouseContract = new NounsAuctionHouseFactory().attach(
    config.addresses.nounsAuctionHouseProxy,
  );

  console.log("config.addresses.nounsAuctionHouseProxy", config.addresses.nounsAuctionHouseProxy)
  const account = useAppSelector(state => state.account.activeAccount);

  const bidInputRef = useRef<HTMLInputElement>(null);

  const [bidInput, setBidInput] = useState('');

  const [bidButtonContent, setBidButtonContent] = useState({
    loading: false,
    content: auctionEnded ? <p>Settle</p> : <p>Place bid</p>,
  });

  const [showConnectModal, setShowConnectModal] = useState(false);

  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  const minBidIncPercentage = useAuctionMinBidIncPercentage();
  const minBid = computeMinimumNextBid(
    auction && new BigNumber(auction.amount.toString()),
    minBidIncPercentage,
  );

  const { send: placeBid, state: placeBidState } = useContractFunction(
    nounsAuctionHouseContract,
    AuctionHouseContractFunction.createBid,
  );
  const { send: settleAuction, state: settleAuctionState } = useContractFunction(
    nounsAuctionHouseContract,
    AuctionHouseContractFunction.settleCurrentAndCreateNewAuction,
  );

  const bidInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    // disable more than 2 digits after decimal point
    if (input.includes('.') && event.target.value.split('.')[1].length > 2) {
      return;
    }

    setBidInput(event.target.value);
  };

  const placeBidHandler = async () => {
    if (!auction || !bidInputRef.current || !bidInputRef.current.value) {
      return;
    }

    if (currentBid(bidInputRef).isLessThan(minBid)) {
      setModal({
        show: true,
        title: <p>Insufficient bid amount 🤏</p>,
        message: (
          <p>
            Please place a bid higher than or equal to the minimum bid amount of {minBidEth(minBid)}{' '}
            ETH
          </p>
        ),
      });
      setBidInput(minBidEth(minBid));
      return;
    }

    const value = utils.parseEther(bidInputRef.current.value.toString());
    const contract = connectContractToSigner(nounsAuctionHouseContract, undefined, undefined);
    const gasLimit = await contract.estimateGas.createBid(auction.nounId, {
      value,
    });
    placeBid(auction.nounId, {
      value,
      gasLimit: gasLimit.mul(1.05), // add 5% buffer TODO: do better
    });
  };

  const settleAuctionHandler = () => {
    settleAuction();
  };

  const clearBidInput = () => {
    if (bidInputRef.current) {
      bidInputRef.current.value = '';
    }
  };

  // successful bid using redux store state
  useEffect(() => {
    if (!account) return;

    // tx state is mining
    const isMiningUserTx = placeBidState.status === 'Mining';
    // allows user to rebid against themselves so long as it is not the same tx
    const isCorrectTx = currentBid(bidInputRef).isEqualTo(new BigNumber(auction.amount.toString()));
    if (isMiningUserTx && auction.bidder === account && isCorrectTx) {
      placeBidState.status = 'Success';
      setModal({
        title: <p>Success</p>,
        message: <p>Bid was placed successfully!</p>,
        show: true,
      });
      setBidButtonContent({ loading: false, content: <p>Place bid</p> });
      clearBidInput();
    }
  }, [auction, placeBidState, account, setModal]);

  // placing bid transaction state hook
  useEffect(() => {
    switch (!auctionEnded && placeBidState.status) {
      case 'None':
        setBidButtonContent({
          loading: false,
          content: <p>Place bid</p>,
        });
        break;
      case 'Mining':
        setBidButtonContent({ loading: true, content: <></> });
        break;
      case 'Fail':
        setModal({
          title: <p>Transaction Failed</p>,
          message: placeBidState?.errorMessage || <p>Please try again.</p>,
          show: true,
        });
        setBidButtonContent({ loading: false, content: <p>Bid</p> });
        break;
      case 'Exception':
        setModal({
          title: <p>Error</p>,
          message: placeBidState?.errorMessage || <p>Please try again.</p>,
          show: true,
        });
        setBidButtonContent({ loading: false, content: <p>Bid</p> });
        break;
    }
  }, [placeBidState, auctionEnded, setModal]);

  // settle auction transaction state hook
  useEffect(() => {
    switch (auctionEnded && settleAuctionState.status) {
      case 'None':
        setBidButtonContent({
          loading: false,
          content: <p>Settle Auction</p>,
        });
        break;
      case 'Mining':
        setBidButtonContent({ loading: true, content: <></> });
        break;
      case 'Success':
        setModal({
          title: <p>Success</p>,
          message: <p>Settled auction successfully!</p>,
          show: true,
        });
        setBidButtonContent({ loading: false, content: <p>Settle Auction</p> });
        break;
      case 'Fail':
        setModal({
          title: <p>Transaction Failed</p>,
          message: settleAuctionState?.errorMessage || <p>Please try again.</p>,
          show: true,
        });
        setBidButtonContent({ loading: false, content: <p>Settle Auction</p> });
        break;
      case 'Exception':
        setModal({
          title: <p>Error</p>,
          message: settleAuctionState?.errorMessage || <p>Please try again.</p>,
          show: true,
        });
        setBidButtonContent({ loading: false, content: <p>Settle Auction</p> });
        break;
    }
  }, [settleAuctionState, auctionEnded, setModal]);

  if (!auction) return null;

  const isDisabled =
    placeBidState.status === 'Mining' || settleAuctionState.status === 'Mining' || !activeAccount;

  const isWalletConnected = activeAccount !== undefined;

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )}
      <InputGroup>
        {!auctionEnded && (
          <>
            <span className={classes.customPlaceholderBidAmt}>
              {!auctionEnded && !bidInput ? (
                <>
                  Ξ {minBidEth(minBid)}{' '}
                  <span
                    className={
                      activeLocale === 'ja-JP' ? responsiveUiUtilsClasses.disableSmallScreens : ''
                    }
                  >
                    <p>or more</p>
                  </span>
                </>
              ) : (
                ''
              )}
            </span>
            <FormControl
              className={classes.bidInput}
              type="number"
              min="0"
              onChange={bidInputHandler}
              ref={bidInputRef}
              value={bidInput}
            />
          </>
        )}
        {!auctionEnded ? (
          <Button
            className={auctionEnded ? classes.bidBtnAuctionEnded : classes.bidBtn}
            onClick={auctionEnded ? settleAuctionHandler : placeBidHandler}
            disabled={isDisabled}
          >
            {bidButtonContent.loading ? <Spinner animation="border" /> : bidButtonContent.content}
          </Button>
        ) : (
          <>
            {/* Only show force settle button if wallet connected */}
            {isWalletConnected && (
              <Col lg={12}>
                <SettleManuallyBtn settleAuctionHandler={settleAuctionHandler} auction={auction} />
              </Col>
            )}
          </>
        )}
      </InputGroup>
    </>
  );
};
export default Bid;
