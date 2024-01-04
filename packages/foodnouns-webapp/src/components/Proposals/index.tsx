import { Proposal, ProposalState } from '../../wrappers/nounsDao';
import { Alert, Button } from 'react-bootstrap';
import ProposalStatus from '../ProposalStatus';
import classes from './Proposals.module.css';
import { useNavigate } from 'react-router-dom';
import { useBlockNumber, useEthers } from '@usedapp/core';
import { isMobileScreen } from '../../utils/isMobile';
import clsx from 'clsx';
import { useUserNounTokenBalance, useUserVotes } from '../../wrappers/nounToken';

import { ClockIcon } from '@heroicons/react/solid';
import proposalStatusClasses from '../ProposalStatus/ProposalStatus.module.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useActiveLocale } from '../../hooks/useActivateLocale';
import { SUPPORTED_LOCALE_TO_DAYSJS_LOCALE, SupportedLocale } from '../../i18n/locales';
import { useState } from 'react';
import DelegationModal from '../DelegationModal';

import en from 'dayjs/locale/en';

dayjs.extend(relativeTime);

const getCountdownCopy = (proposal: Proposal, currentBlock: number, locale: SupportedLocale) => {
  const AVERAGE_BLOCK_TIME_IN_SECS = 13;
  const timestamp = Date.now();
  const startDate =
    proposal && timestamp && currentBlock
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * (proposal.startBlock - currentBlock),
          'seconds',
        )
      : undefined;

  const endDate =
    proposal && timestamp && currentBlock
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * (proposal.endBlock - currentBlock),
          'seconds',
        )
      : undefined;

  const expiresDate = proposal && dayjs(proposal.eta).add(14, 'days');

  const now = dayjs();

  if (startDate?.isBefore(now) && endDate?.isAfter(now)) {
    return (
      <p>
        Ends {endDate.locale(SUPPORTED_LOCALE_TO_DAYSJS_LOCALE[locale] || en).fromNow()}
      </p>
    );
  }
  if (endDate?.isBefore(now)) {
    return (
      <p>
        Expires {expiresDate.locale(SUPPORTED_LOCALE_TO_DAYSJS_LOCALE[locale] || en).fromNow()}
      </p>
    );
  }
  return (
    <p>
      Starts{' '}
      {dayjs(startDate)
        .locale(SUPPORTED_LOCALE_TO_DAYSJS_LOCALE[locale] || en)
        .fromNow()}
    </p>
  );
};

const Proposals = ({ proposals }: { proposals: Proposal[] }) => {
  const navigate = useNavigate();

  const { account } = useEthers();
  const connectedAccountNounVotes = useUserVotes() || 0;
  const currentBlock = useBlockNumber();
  const isMobile = isMobileScreen();
  const activeLocale = useActiveLocale();
  const [showDelegateModal, setShowDelegateModal] = useState(false);

  const nullStateCopy = () => {
    if (account !== null) {
      return <p>You have no Votes.</p>;
    }
    return <p>Connect wallet to make a proposal.</p>;
  };

  const hasNounVotes = account !== undefined && connectedAccountNounVotes > 0;
  const hasNounBalance =
    (useUserNounTokenBalance() ?? 0) > 0;
  return (
    <div className={classes.proposals}>
      {showDelegateModal && <DelegationModal onDismiss={() => setShowDelegateModal(false)} />}
      <div className={clsx(classes.headerWrapper, !hasNounVotes ? classes.forceFlexRow : '')}>
        <h3 className={classes.heading}>
          <p>Proposals</p>
        </h3>
        {hasNounVotes ? (
          <div className={classes.nounInWalletBtnWrapper}>
            <div className={classes.submitProposalButtonWrapper}>
              <Button
                className={classes.generateBtn}
                onClick={() => navigate('create-proposal')}
              >
                <p>Submit Proposal</p>
              </Button>
            </div>

            {hasNounBalance && (
              <div className={classes.delegateBtnWrapper}>
                <Button
                  className={classes.changeDelegateBtn}
                  onClick={() => setShowDelegateModal(true)}
                >
                  <p>Delegate</p>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className={clsx('d-flex', classes.nullStateSubmitProposalBtnWrapper)}>
            {!isMobile && <div className={classes.nullStateCopy}>{nullStateCopy()}</div>}
            <div className={classes.nullBtnWrapper}>
              <Button className={classes.generateBtnDisabled}>
                <p>Submit Proposal</p>
              </Button>
            </div>
            {!isMobile && hasNounBalance && (
              <div className={classes.delegateBtnWrapper}>
                <Button
                  className={classes.changeDelegateBtn}
                  onClick={() => setShowDelegateModal(true)}
                >
                  <p>Delegate</p>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      {isMobile && <div className={classes.nullStateCopy}>{nullStateCopy()}</div>}
      {isMobile && hasNounBalance && (
        <div>
          <Button className={classes.changeDelegateBtn} onClick={() => setShowDelegateModal(true)}>
            <p>Delegate</p>
          </Button>
        </div>
      )}
      {proposals?.length ? (
        proposals
          .slice(0)
          .reverse()
          .map((p, i) => {
            const isPropInStateToHaveCountDown =
              p.status === ProposalState.PENDING ||
              p.status === ProposalState.ACTIVE ||
              p.status === ProposalState.QUEUED;

            const countdownPill = (
              <div className={classes.proposalStatusWrapper}>
                <div className={clsx(proposalStatusClasses.proposalStatus, classes.countdownPill)}>
                  <div className={classes.countdownPillContentWrapper}>
                    <span className={classes.countdownPillClock}>
                      <ClockIcon height={16} width={16} />
                    </span>{' '}
                    <span className={classes.countdownPillText}>
                      {getCountdownCopy(p, currentBlock || 0, activeLocale)}
                    </span>
                  </div>
                </div>
              </div>
            );

            return (
              <div
                className={clsx(classes.proposalLink, classes.proposalLinkWithCountdown)}
                onClick={() => navigate(`/vote/${p.id}`)}
                key={i}
              >
                <div className={classes.proposalInfoWrapper}>
                  <span className={classes.proposalTitle}>
                    <span className={classes.proposalId}>{i18n.number(parseInt(p.id || '0'))}</span>{' '}
                    <span>{p.title}</span>
                  </span>

                  {isPropInStateToHaveCountDown && (
                    <div className={classes.desktopCountdownWrapper}>{countdownPill}</div>
                  )}
                  <div className={clsx(classes.proposalStatusWrapper, classes.votePillWrapper)}>
                    <ProposalStatus status={p.status}></ProposalStatus>
                  </div>
                </div>

                {isPropInStateToHaveCountDown && (
                  <div className={classes.mobileCountdownWrapper}>{countdownPill}</div>
                )}
              </div>
            );
          })
      ) : (
        <Alert variant="secondary">
          <Alert.Heading>
            <p>No proposals found</p>
          </Alert.Heading>
          <p>
            <p>Proposals submitted by community members will appear here.</p>
          </p>
        </Alert>
      )}
    </div>
  );
};
export default Proposals;
