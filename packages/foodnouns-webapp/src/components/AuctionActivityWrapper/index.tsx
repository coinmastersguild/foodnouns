import { FC, ReactNode } from 'react';
import classes from './AuctionActivityWrapper.module.css';


interface AuctionActivityWrapperProps {
  children?: ReactNode | any; // TODO look at this again
}

const AuctionActivityWrapper: FC<AuctionActivityWrapperProps> = (props) => {
  return <div className={classes.wrapper}>{props?.children}</div>;
};
export default AuctionActivityWrapper;
