import { BigNumber } from 'ethers';
import classes from './AuctionActivityNounTitle.module.css';
import { Trans } from '@lingui/macro';

const AuctionActivityNounTitle: React.FC<{ nounId: BigNumber; isCool?: boolean, nounAuction: boolean }> = props => {
  const { nounId, isCool, nounAuction } = props;
  return (
    <div className={classes.wrapper}>
      <h1 style={{ color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)' }}>
        <Trans>{nounAuction ? 'NOUN' : 'FOODNOUN'} {nounId.toString()}</Trans>
      </h1>
    </div>
  );
};
export default AuctionActivityNounTitle;
