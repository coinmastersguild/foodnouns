import classes from './ProposalStatus.module.css';
import { ProposalState } from '../../wrappers/nounsDao';
import React from 'react';
import clsx from 'clsx';


const statusVariant = (status: ProposalState | undefined) => {
  switch (status) {
    case ProposalState.PENDING:
    case ProposalState.ACTIVE:
      return classes.primary;
    case ProposalState.SUCCEEDED:
    case ProposalState.EXECUTED:
      return classes.success;
    case ProposalState.DEFEATED:
    case ProposalState.VETOED:
      return classes.danger;
    case ProposalState.QUEUED:
    case ProposalState.CANCELLED:
    case ProposalState.EXPIRED:
    default:
      return classes.secondary;
  }
};

const statusText = (status: ProposalState | undefined) => {
  switch (status) {
    case ProposalState.PENDING:
      return <p>Pending</p>;
    case ProposalState.ACTIVE:
      return <p>Active</p>;
    case ProposalState.SUCCEEDED:
      return <p>Succeeded</p>;
    case ProposalState.EXECUTED:
      return <p>Executed</p>;
    case ProposalState.DEFEATED:
      return <p>Defeated</p>;
    case ProposalState.QUEUED:
      return <p>Queued</p>;
    case ProposalState.CANCELLED:
      return <p>Canceled</p>;
    case ProposalState.VETOED:
      return <p>Vetoed</p>;
    case ProposalState.EXPIRED:
      return <p>Expired</p>;
    default:
      return <p>Undetermined</p>;
  }
};

interface ProposalStateProps {
  status?: ProposalState;
  className?: string;
}

const ProposalStatus: React.FC<ProposalStateProps> = props => {
  const { status, className } = props;
  return (
    <div className={clsx(statusVariant(status), classes.proposalStatus, className)}>
      {statusText(status)}
    </div>
  );
};

export default ProposalStatus;
