import Banner from '../../components/Banner';
import Auction from '../../components/Auction';
import Documentation from '../../components/Documentation';
import Leaderboard from '../../components/Leaderboard';
import Settlements from '../../components/Settlements';
import Contribution from '../../components/Contribution';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { push } from 'connected-react-router';
import { nounPath } from '../../utils/history';
import useOnDisplayNounAuction from '../../wrappers/onDisplayNounAuction';
import useOnDisplayFoodNounAuction from '../../wrappers/onDisplayFoodNounAuction';
import { useEffect } from 'react';
import ProfileActivityFeed from '../../components/ProfileActivityFeed';
import { setOnDisplayAuctionFoodNounId } from '../../state/slices/onDisplayFoodNounAuction';
import NounDivider from '../../components/NounDivider/NounDivider';
import classes from './NounDivider.module.css';


interface AuctionPageProps {
  initialAuctionId?: number;
}

const AuctionPage: React.FC<AuctionPageProps> = props => {
  const { initialAuctionId } = props;
  const onDisplayNounAuction = useOnDisplayNounAuction();
  const onDisplayFoodNounAuction = useOnDisplayFoodNounAuction();
  const lastAuctionFoodNounId = useAppSelector(state => state.onDisplayFoodNounAuction.lastAuctionFoodNounId);

  console.log("on display onDisplayFoodNounAuction", onDisplayFoodNounAuction, onDisplayNounAuction)
  console.log("on display onDisplayNounAuction", onDisplayNounAuction)
  console.log("lastAuctionFoodNounId", lastAuctionFoodNounId)

  const onDisplayAuctionFoodNounId = onDisplayFoodNounAuction?.nounId.toNumber();


  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!lastAuctionFoodNounId) return;

    if (initialAuctionId !== undefined) {
      // handle out of bounds noun path ids
      if (initialAuctionId > lastAuctionFoodNounId || initialAuctionId < 0) {
        dispatch(setOnDisplayAuctionFoodNounId(lastAuctionFoodNounId));
        dispatch(push(nounPath(lastAuctionFoodNounId)));
      } else {
        if (onDisplayFoodNounAuction === undefined) {
          // handle regular noun path ids on first load
          dispatch(setOnDisplayAuctionFoodNounId(initialAuctionId));
        }
      }
    } else {
      // no noun path id set
      if (lastAuctionFoodNounId) {
        dispatch(setOnDisplayAuctionFoodNounId(lastAuctionFoodNounId));
      }
    }
  }, [dispatch, initialAuctionId, onDisplayFoodNounAuction, lastAuctionFoodNounId]);

  return (
    <>
      <Auction auction={onDisplayFoodNounAuction} />
      <NounDivider />
      <Auction auction={onDisplayNounAuction} />
      <div className={classes.wrapper}></div>
      {onDisplayAuctionFoodNounId !== undefined && onDisplayAuctionFoodNounId !== lastAuctionFoodNounId ? (
        <>
          <ProfileActivityFeed nounId={onDisplayAuctionFoodNounId} />
          <Leaderboard tops={10} />
          <Contribution />
        </>
      ) : (
        <>
          <Leaderboard tops={10} />
          <Settlements tops={10} />
          <Contribution />
          <Banner />
        </>
      )}

      <Documentation />
    </>
  );
};
export default AuctionPage;
