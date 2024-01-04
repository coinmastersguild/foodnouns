import { BigNumber } from 'ethers';
import classes from './AuctionActivityNounTitle.module.css';


const AuctionActivityNounTitle: React.FC<{ nounId: BigNumber; isCool?: boolean, nounAuction: boolean }> = props => {
  const { nounId, isCool, nounAuction } = props;
  return (
    <div className={classes.wrapper}>
      <h1 style={{ color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)' }}>
        {nounAuction ? 'NOUN' : 'FOODNOUN'} {nounId.toString()}
      </h1>
    </div>
  );
};
export default AuctionActivityNounTitle;
