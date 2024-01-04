import { Routes, Route, useLocation, redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/css/globals.css';
import  './App.css';
import { useEffect } from 'react';
import { ChainId, useEthers, Chain, DAppProvider, DEFAULT_SUPPORTED_CHAINS } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import { setActiveAccount } from './state/slices/account';
import { setAlertModal } from './state/slices/application';
import AlertModal from './components/Modal';
import NavBar from './components/NavBar';
import NetworkAlert from './components/NetworkAlert';
import Footer from './components/Footer';
import AuctionPage from './pages/Auction';
import GovernancePage from './pages/Governance';
import CreateProposalPage from './pages/CreateProposal';
import VotePage from './pages/Vote';
import NoundersPage from './pages/Nounders';
import NotFoundPage from './pages/NotFound';
import Playground from './pages/Playground';
import Leaderboard from './pages/Leaderboard';
import Settlements from './pages/Settlements';
import Unminted from './pages/Unminted';
import { AvatarProvider } from '@davatar/react';
import { createBrowserHistory, History } from 'history';

import { useQuery } from '@apollo/client';
import { Web3ReactProvider } from '@web3-react/core';
import { BigNumber, BigNumberish, Event, providers } from 'ethers';

import { clientFactory, latestAuctionsQuery } from './wrappers/subgraph';
import LogsUpdater from './state/updaters/logs';
import config, { CHAIN_ID, createNetworkHttpUrl } from './config';
import { Web3Provider, WebSocketProvider } from '@ethersproject/providers';
import { NounsAuctionHouseFactory } from '@foodnouns/sdk';
import { nounPath } from './utils/history';
import { ConnectedRouter, push } from 'connected-react-router';
import { Auction } from './wrappers/nounsAuction';
import {
  appendBid, reduxSafeAuction,
  reduxSafeBid,
  reduxSafeNewAuction,
  setActiveAuction,
  setAuctionExtended, setAuctionSettled, setFullAuction,
} from './state/slices/auction';
import { setLastAuctionNounId, setOnDisplayAuctionNounId } from './state/slices/onDisplayNounAuction';
import { setLastAuctionFoodNounId, setOnDisplayAuctionFoodNounId } from './state/slices/onDisplayFoodNounAuction';
import { addPastFoodNounAuctions, addPastNounAuctions } from './state/slices/pastAuctions';
import { DarkModeProvider } from './DarkModeContext';

export const history = createBrowserHistory();
export const foodNounGraphClient = clientFactory(config.foodnounsApp.subgraphApiUri);
export const nounGraphClient = clientFactory(config.nounsApp.subgraphApiUri);

const supportedChainURLs = {
  [ChainId.Mainnet]: createNetworkHttpUrl('mainnet'),
  [ChainId.Hardhat]: 'http://localhost:8545',
  [ChainId.Goerli]: createNetworkHttpUrl('goerli'),
};

const useDappConfig = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [CHAIN_ID]: supportedChainURLs[CHAIN_ID],
  },
  networks: [...DEFAULT_SUPPORTED_CHAINS],
};

const Updaters = () => {
  return (
    <>
      <LogsUpdater />
    </>
  );
};

const BLOCKS_PER_DAY = 7_145;

const ChainSubscriber: React.FC = () => {
  const dispatch = useAppDispatch();

  const loadState = async () => {
    const nounsWsProvider = new WebSocketProvider(config.nounsApp.wsRpcUri);
    const foodNounsWsProvider = new WebSocketProvider(config.foodnounsApp.wsRpcUri);

    const nounsAuctionHouseContract = NounsAuctionHouseFactory.connect(
      '0x830BD73E4184ceF73443C15111a1DF14e495C706', // OG Nouns DAO AuctionHouseProxy
      nounsWsProvider,
    );

    const foodnounsAuctionHouseContract = NounsAuctionHouseFactory.connect(
      config.addresses.nounsAuctionHouseProxy, // FoodNouns DAO AuctionHouseProxy
      foodNounsWsProvider,
    );

    const nounbidFilter = nounsAuctionHouseContract.filters.AuctionBid(null, null, null, null);
    const nounextendedFilter = nounsAuctionHouseContract.filters.AuctionExtended(null, null);
    const nouncreatedFilter = nounsAuctionHouseContract.filters.AuctionCreated(null, null, null);
    const nounsettledFilter = nounsAuctionHouseContract.filters.AuctionSettled(null, null, null);

    const foodNounBidFilter = foodnounsAuctionHouseContract.filters.AuctionBid(
      null,
      null,
      null,
      null,
    );
    const foodnounextendedFilter = foodnounsAuctionHouseContract.filters.AuctionExtended(
      null,
      null,
    );
    const foodnouncreatedFilter = foodnounsAuctionHouseContract.filters.AuctionCreated(
      null,
      null,
      null,
    );
    const foodnounsettledFilter = foodnounsAuctionHouseContract.filters.AuctionSettled(
      null,
      null,
      null,
    );

    const processBidFilter = async (
      nounId: BigNumberish,
      sender: string,
      value: BigNumberish,
      extended: boolean,
      event: Event,
    ) => {
      const timestamp = (await event.getBlock()).timestamp;
      const transactionHash = event.transactionHash;
      dispatch(
        appendBid(reduxSafeBid({ nounId, sender, value, extended, transactionHash, timestamp })),
      );
    };
    const processAuctionCreated = (
      nounId: BigNumberish,
      startTime: BigNumberish,
      endTime: BigNumberish,
      nounAuction = false,
    ) => {
      dispatch(
        setActiveAuction(
          reduxSafeNewAuction({ nounId, startTime, endTime, settled: false, nounAuction }),
        ),
      );
      const nounIdNumber = BigNumber.from(nounId).toNumber();
      dispatch(push(nounPath(nounIdNumber)));
      if (nounAuction) {
        dispatch(setOnDisplayAuctionNounId(nounIdNumber));
        dispatch(setLastAuctionNounId(nounIdNumber));
      } else {
        dispatch(setOnDisplayAuctionFoodNounId(nounIdNumber));
        dispatch(setLastAuctionFoodNounId(nounIdNumber));
      }
    };
    const processAuctionExtended = (nounId: BigNumberish, endTime: BigNumberish) => {
      dispatch(setAuctionExtended({ nounId, endTime }));
    };
    const processAuctionSettled = (nounId: BigNumberish, winner: string, amount: BigNumberish) => {
      dispatch(setAuctionSettled({ nounId, amount, winner }));
    };

    // Fetch the current auction
    let fetchedAuction = await nounsAuctionHouseContract.auction();
    const currentNounAuction: Auction = { ...fetchedAuction, nounAuction: true };
    dispatch(setFullAuction(reduxSafeAuction(currentNounAuction)));
    dispatch(setOnDisplayAuctionNounId(currentNounAuction.nounId.toNumber()));
    dispatch(setLastAuctionNounId(currentNounAuction.nounId.toNumber()));

    // Fetch the current auction
    fetchedAuction = await foodnounsAuctionHouseContract.auction();
    const currentFoodNounAuction: Auction = { ...fetchedAuction, nounAuction: false };
    dispatch(setFullAuction(reduxSafeAuction(currentFoodNounAuction)));
    dispatch(setLastAuctionFoodNounId(currentFoodNounAuction.nounId.toNumber()));

    // Fetch the previous 24hours of  bids
    const previousNounBids = await nounsAuctionHouseContract.queryFilter(
      nounbidFilter,
      0 - BLOCKS_PER_DAY,
    );
    for (const event of previousNounBids) {
      if (event.args === undefined) return;
      void processBidFilter(...(event.args as [BigNumber, string, BigNumber, boolean]), event);
    }

    // Fetch the previous 24hours of  bids
    const previousFoodNounBids = await foodnounsAuctionHouseContract.queryFilter(
      foodNounBidFilter,
      0 - BLOCKS_PER_DAY,
    );
    for (const event of previousFoodNounBids) {
      if (event.args === undefined) return;
      void processBidFilter(...(event.args as [BigNumber, string, BigNumber, boolean]), event);
    }

    nounsAuctionHouseContract.on(nounbidFilter, (nounId, sender, value, extended, event) =>
      processBidFilter(nounId, sender, value, extended, event),
    );
    nounsAuctionHouseContract.on(nouncreatedFilter, (nounId, startTime, endTime) =>
      processAuctionCreated(nounId, startTime, endTime),
    );
    nounsAuctionHouseContract.on(nounextendedFilter, (nounId, endTime) =>
      processAuctionExtended(nounId, endTime),
    );
    nounsAuctionHouseContract.on(nounsettledFilter, (nounId, winner, amount) =>
      processAuctionSettled(nounId, winner, amount),
    );

    foodnounsAuctionHouseContract.on(foodNounBidFilter, (nounId, sender, value, extended, event) =>
      processBidFilter(nounId, sender, value, extended, event),
    );
    foodnounsAuctionHouseContract.on(foodnouncreatedFilter, (nounId, startTime, endTime) =>
      processAuctionCreated(nounId, startTime, endTime),
    );
    foodnounsAuctionHouseContract.on(foodnounextendedFilter, (nounId, endTime) =>
      processAuctionExtended(nounId, endTime),
    );
    foodnounsAuctionHouseContract.on(foodnounsettledFilter, (nounId, winner, amount) =>
      processAuctionSettled(nounId, winner, amount),
    );
  };
  void loadState();

  return <></>;
};

const PastAuctions: React.FC = () => {
  const latestFoodNounAuctionId = useAppSelector(
    state => state.onDisplayFoodNounAuction.lastAuctionFoodNounId,
  );
  const latestNounAuctionId = useAppSelector(
    state => state.onDisplayNounAuction.lastAuctionNounId
  );
  const { data: foodnounData } = useQuery(latestAuctionsQuery(), { client: foodNounGraphClient });
  const { data: nounData } = useQuery(latestAuctionsQuery(), { client: nounGraphClient });
  const dispatch = useAppDispatch();

  useEffect(() => {
    nounData && dispatch(addPastNounAuctions(nounData));
    foodnounData && dispatch(addPastFoodNounAuctions(foodnounData));
  }, [latestFoodNounAuctionId, dispatch, foodnounData, nounData]);

  return <></>;
};


function App() {
  const { account, chainId, library } = useEthers();
  const dispatch = useAppDispatch();

  const activeAccount = useAppSelector(state => state.account.activeAccount);

  useEffect(() => {
    if (!!account && !!activeAccount) {
    }
    dispatch(setActiveAccount(account));
  }, [account, dispatch, activeAccount, chainId]);

  const alertModal = useAppSelector(state => state.application.alertModal);

  return (
      <div className="wrapper">
        {/*{chainId && Number(CHAIN_ID) !== chainId && <NetworkAlert />}*/}
        {alertModal.show && (
          <AlertModal
            title={alertModal.title}
            content={<p>{alertModal.message}</p>}
            onDismiss={() => dispatch(setAlertModal({ ...alertModal, show: false }))}
          />
        )}
        <ChainSubscriber />
        <Web3ReactProvider
          getLibrary={
            provider => new Web3Provider(provider)
          }
        >
            <DAppProvider config={useDappConfig}>
        <NavBar />

        <Routes>
        <Route
          path="/"
          element={<AuctionPage />}
        />
          {/*<Route from="/foodnoun-auction/:id" to="/foodnoun/:id" />*/}
          {/*<Route*/}
          {/*  exact*/}
          {/*  path="/foodnoun/:id"*/}
          {/*  render={props => <AuctionPage initialAuctionId={Number(props.match.params.id)} />}*/}
          {/*/>*/}
          {/*<Route exact path="/nounders" component={NoundersPage} />*/}
          {/*<Route exact path="/create-proposal" component={CreateProposalPage} />*/}
          {/*<Route exact path="/vote" component={GovernancePage} />*/}
          {/*<Route exact path="/vote/:id" component={VotePage} />*/}
          {/*<Route exact path="/playground" component={Playground} />*/}
          {/*<Route exact path="/leaderboard" component={Leaderboard} />*/}
          {/*<Route exact path="/settlements" component={Settlements} />*/}
          {/*<Route exact path="/unminted" component={Unminted} />*/}
          <Route element={<NotFoundPage />} />
        </Routes>

        <Footer />
              <Updaters />
            </DAppProvider>
        </Web3ReactProvider>
      </div>
  );
}

export default App;
