import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './state/store';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import './i18n.js';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

ReactDOM.render(
  <BrowserRouter>
    {/*<React.StrictMode>*/}
      <Provider store={store}>
        <App />
      </Provider>
    {/*</React.StrictMode>*/}
  </BrowserRouter>,
  //   <ConnectedRouter history={history}>
  //     <ChainSubscriber />
  //     {/*<React.StrictMode>*/}
  //     <Web3ReactProvider
  //       getLibrary={
  //         provider => new Web3Provider(provider)
  //       }
  //     >
  //         <DAppProvider config={useDappConfig}>
  //           <LanguageProvider>
  //             <DarkModeProvider>
  //             <App />
  //             </DarkModeProvider>
  //           </LanguageProvider>
  //           <Updaters />
  //         </DAppProvider>
  //     </Web3ReactProvider>
  //       {/*</React.StrictMode>*/}
  //   </ConnectedRouter>
  // </Provider>,
  document.getElementById('root'),
);
