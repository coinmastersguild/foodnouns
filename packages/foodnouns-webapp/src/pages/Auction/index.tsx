import Banner from '../../components/Banner';
import Auction from '../../components/Auction';
import Documentation from '../../components/Documentation';
import Leaderboard from '../../components/Leaderboard';
import Settlements from '../../components/Settlements';
import Contribution from '../../components/Contribution';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { push } from 'connected-react-router';
import { nounPath } from '../../utils/history';
import useOnDisplayNounAuction from '../../wrappers/onDisplayNounAuction';
import useOnDisplayFoodNounAuction from '../../wrappers/onDisplayFoodNounAuction';
import { useEffect } from 'react';
import ProfileActivityFeed from '../../components/ProfileActivityFeed';
import { setOnDisplayAuctionFoodNounId } from '../../state/slices/onDisplayFoodNounAuction';
import NounDivider from '../../components/NounDivider/NounDivider';
import NounDividerEmpty from '../../components/NounDividerEmpty/NounDivider';
import { foodNounGraphClient, nounGraphClient } from '../../App';
import { ApolloProvider } from '@apollo/client/react/context/ApolloProvider';

interface AuctionPageProps {
  initialAuctionId?: number;
}

const AuctionPage = (props: AuctionPageProps) => {
  const { initialAuctionId } = props;
  const onDisplayNounAuction = useOnDisplayNounAuction();
  const onDisplayFoodNounAuction = useOnDisplayFoodNounAuction();
  const lastAuctionFoodNounId = useAppSelector(
    (state: { onDisplayFoodNounAuction: { lastAuctionFoodNounId: any } }) =>
      state.onDisplayFoodNounAuction.lastAuctionFoodNounId,
  );

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
      <ApolloProvider client={foodNounGraphClient}>
        <Auction auction={onDisplayFoodNounAuction} />
      </ApolloProvider>
      <NounDivider />
      <ApolloProvider client={nounGraphClient}>
        <Auction auction={onDisplayNounAuction} />
      </ApolloProvider>
      <NounDividerEmpty />
      {onDisplayAuctionFoodNounId !== undefined &&
      onDisplayAuctionFoodNounId !== lastAuctionFoodNounId ? (
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
