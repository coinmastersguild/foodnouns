import Banner from '../../components/Banner';
import Auction from '../../components/Auction';
import Documentation from '../../components/Documentation';
import Leaderboard from '../../components/Leaderboard';
import Settlements from '../../components/Settlements';
import Contribution from '../../components/Contribution';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { push } from 'connected-react-router';
import { nounPath } from '../../utils/history';
import useOnDisplayAuction from '../../wrappers/useOnDisplayAuction';
import { useEffect } from 'react';
import ProfileActivityFeed from '../../components/ProfileActivityFeed';
import onDisplayFoodNounAuction, { setOnDisplayAuctionFoodNounId } from '../../state/slices/onDisplayFoodNounAuction';
import NounDivider from '../../components/NounDivider/NounDivider';
import NounDividerEmpty from '../../components/NounDividerEmpty/NounDivider';

interface AuctionPageProps {
  initialFoodNounAuctionId?: number;
  initialFoodNounAuctionId?: number;
}

const AuctionPage: React.FC<AuctionPageProps> = props => {
  const { initialFoodNounAuctionId,initialFoodNounAuctionId } = props;

  const onDisplayNounAuction = useOnDisplayAuction();
  const lastAuctionFoodNounId = useAppSelector(state => state.onDisplayFoodNounAuction.lastAuctionFoodNounId);
  // @ts-ignore
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
  }, [dispatch, initialAuctionId, lastAuctionFoodNounId]);


  // @ts-ignore
  return (
    <>
      <Auction auction={onDisplayFoodNounAuction} />
      <NounDivider />
      <Auction auction={onDisplayNounAuction} />
      <NounDividerEmpty />
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
