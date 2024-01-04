import Modal from '../Modal';
import WalletButton from '../WalletButton';
import { WALLET_TYPE } from '../WalletButton';
import { useEthers } from '@usedapp/core';
import clsx from 'clsx';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { FortmaticConnector } from '@web3-react/fortmatic-connector';
import config, { CHAIN_ID } from '../../config';
import classes from './WalletConnectModal.module.css';


const WalletConnectModal: React.FC<{ onDismiss: () => void }> = props => {
  const { onDismiss } = props;
  const { activate } = useEthers();
  const supportedChainIds = [CHAIN_ID];

  const wallets = (
    <div className={classes.walletConnectModal}>
      <WalletButton
        onClick={() => {
          const injected = new InjectedConnector({
            supportedChainIds,
          });
          activate(injected);
        }}
        walletType={WALLET_TYPE.metamask}
      />
      <WalletButton
        onClick={() => {
          const fortmatic = new FortmaticConnector({
            apiKey: 'pk_live_60FAF077265B4CBA',
            chainId: CHAIN_ID,
          });
          activate(fortmatic);
        }}
        walletType={WALLET_TYPE.fortmatic}
      />
      <WalletButton
        onClick={() => {
          const walletlink = new WalletLinkConnector({
            appName: 'foodnouns.WTF',
            appLogoUrl: 'https://nouns.wtf/static/media/logo.cdea1650.svg',
            url: config.foodnounsApp.jsonRpcUri,
            supportedChainIds,
          });
          activate(walletlink);
        }}
        walletType={WALLET_TYPE.coinbaseWallet}
      />
      <WalletButton
        onClick={() => {
          const injected = new InjectedConnector({
            supportedChainIds,
          });
          activate(injected);
        }}
        walletType={WALLET_TYPE.brave}
      />
      {/* <WalletButton
        onClick={() => {
          const ledger = new LedgerConnector({
            //TODO: refactor
            chainId: config.supportedChainId,
            url: config.rinkebyJsonRpc,
          });
          activate(ledger);
        }}
        walletType={WALLET_TYPE.ledger}
      /> */}
      {/*<WalletButton*/}
      {/*  onClick={() => {*/}
      {/*    const trezor = new TrezorConnector({*/}
      {/*      chainId: CHAIN_ID,*/}
      {/*      url: config.foodnounsApp.jsonRpcUri,*/}
      {/*      manifestAppUrl: 'https://nouns.wtf',*/}
      {/*      manifestEmail: 'nounops+trezorconnect@protonmail.com',*/}
      {/*    });*/}
      {/*    activate(trezor);*/}
      {/*  }}*/}
      {/*  walletType={WALLET_TYPE.trezor}*/}
      {/*/>*/}
      <div
        className={clsx(classes.clickable, classes.walletConnectData)}
        onClick={() => localStorage.removeItem('walletconnect')}
      >
        <p>Clear WalletConnect Data</p>
      </div>
    </div>
  );
  return (
    <Modal title={<p>Connect your wallet</p>} content={wallets} onDismiss={onDismiss} />
  );
};
export default WalletConnectModal;
