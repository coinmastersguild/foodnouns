import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChainId, DAppProvider } from '@usedapp/core';
import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import account from './state/slices/account';
import application from './state/slices/application';
import logs from './state/slices/logs';
// import { DarkModeProvider } from './DarkModeContext';
import auction, {
  reduxSafeAuction,
  reduxSafeNewAuction,
  reduxSafeBid,
  setActiveAuction,
  setAuctionExtended,
  setAuctionSettled,
  setFullAuction,
} from './state/slices/auction';
import onDisplayNounAuction, {
  setLastAuctionNounId,
  setOnDisplayAuctionNounId,
} from './state/slices/onDisplayNounAuction';
import onDisplayFoodNounAuction, {
  setLastAuctionFoodNounId,
  setOnDisplayAuctionFoodNounId,
} from './state/slices/onDisplayFoodNounAuction';
import { ApolloProvider, useQuery } from '@apollo/client';
import { clientFactory, latestAuctionsQuery } from './wrappers/subgraph';
import { useEffect } from 'react';
import pastAuctions, { addPastNounAuctions, addPastFoodNounAuctions } from './state/slices/pastAuctions';
import LogsUpdater from './state/updaters/logs';
import config, { CHAIN_ID, createNetworkHttpUrl } from './config';
import { WebSocketProvider } from '@ethersproject/providers';
import { BigNumber, BigNumberish } from 'ethers';
import { NounsAuctionHouseFactory } from '@foodnouns/sdk';
import { useAppDispatch, useAppSelector } from './hooks';
import { appendBid } from './state/slices/auction';
import { ConnectedRouter, connectRouter } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { applyMiddleware, createStore, combineReducers, PreloadedState } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { nounPath } from './utils/history';
import { push } from 'connected-react-router';
import { LanguageProvider } from './i18n/LanguageProvider';
import { Auction } from './wrappers/nounsAuction';

export const history = createBrowserHistory();

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    account,
    application,
    auction,
    logs,
    pastAuctions,
    onDisplayNounAuction,
    onDisplayFoodNounAuction
  });

export default function configureStore(preloadedState: PreloadedState<never>) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        // ... other middlewares ...
      ),
    ),
  );

  return store;
}

const store = configureStore({});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const supportedChainURLs = {
  [ChainId.Mainnet]: createNetworkHttpUrl('mainnet'),
  [ChainId.Hardhat]: 'http://localhost:8545',
};

// prettier-ignore
const useDappConfig = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [CHAIN_ID]: supportedChainURLs[CHAIN_ID],
  },
};

export const nounclient = clientFactory(config.nounsApp.subgraphApiUri);
export const client = clientFactory(config.foodnounsApp.subgraphApiUri);

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
    const nounswsProvider = new WebSocketProvider(config.nounsApp.wsRpcUri);
    const foodnounswsProvider = new WebSocketProvider(config.foodnounsApp.wsRpcUri);

    const nounsAuctionHouseContract = NounsAuctionHouseFactory.connect(
      "0x830BD73E4184ceF73443C15111a1DF14e495C706",
      nounswsProvider,
    );

    const foodnounsAuctionHouseContract = NounsAuctionHouseFactory.connect(
      config.addresses.nounsAuctionHouseProxy,
      foodnounswsProvider,
    );

    const nounbidFilter = nounsAuctionHouseContract.filters.AuctionBid(null, null, null, null);
    const nounextendedFilter = nounsAuctionHouseContract.filters.AuctionExtended(null, null);
    const nouncreatedFilter = nounsAuctionHouseContract.filters.AuctionCreated(null, null, null);
    const nounsettledFilter = nounsAuctionHouseContract.filters.AuctionSettled(null, null, null);

    const foodnounbidFilter = foodnounsAuctionHouseContract.filters.AuctionBid(null, null, null, null);
    const foodnounextendedFilter = foodnounsAuctionHouseContract.filters.AuctionExtended(null, null);
    const foodnouncreatedFilter = foodnounsAuctionHouseContract.filters.AuctionCreated(null, null, null);
    const foodnounsettledFilter = foodnounsAuctionHouseContract.filters.AuctionSettled(null, null, null);

    const processBidFilter = async (
      nounId: BigNumberish,
      sender: string,
      value: BigNumberish,
      extended: boolean,
      event: any,
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
        setActiveAuction(reduxSafeNewAuction({ nounId, startTime, endTime, settled: false, nounAuction })),
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
    const previousNounBids = await nounsAuctionHouseContract.queryFilter(nounbidFilter, 0 - BLOCKS_PER_DAY);
    for (const event of previousNounBids) {
      if (event.args === undefined) return;
      void processBidFilter(...(event.args as [BigNumber, string, BigNumber, boolean]), event);
    }

    // Fetch the previous 24hours of  bids
    const previousFoodNounBids = await foodnounsAuctionHouseContract.queryFilter(foodnounbidFilter, 0 - BLOCKS_PER_DAY);
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

    foodnounsAuctionHouseContract.on(foodnounbidFilter, (nounId, sender, value, extended, event) =>
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
  loadState();

  return <></>;
};

const PastAuctions: React.FC = () => {
  const latestAuctionId = useAppSelector(state => state.onDisplayFoodNounAuction.lastAuctionFoodNounId);
  const { data: foodnounData } = useQuery(latestAuctionsQuery(), { client });
  const { data: nounData } = useQuery(latestAuctionsQuery(), { client: nounclient });
  const dispatch = useAppDispatch();

  useEffect(() => {
    nounData && dispatch(addPastNounAuctions(nounData));
    foodnounData && dispatch(addPastFoodNounAuctions(foodnounData));
  }, [latestAuctionId, dispatch, foodnounData, nounData]);

  return <></>;
};

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ChainSubscriber />
      <React.StrictMode>
        <Web3ReactProvider
          getLibrary={
            provider => new providers.JsonRpcProvider(provider) // ethers v5
          }
        >
          <ApolloProvider client={client}>
            <PastAuctions />
            <DAppProvider config={useDappConfig}>
              <LanguageProvider>
                {/*<DarkModeProvider>*/}
                  <App />
                {/*</DarkModeProvider>*/}
              </LanguageProvider>
              <Updaters />
            </DAppProvider>
          </ApolloProvider>
        </Web3ReactProvider>
      </React.StrictMode>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);
