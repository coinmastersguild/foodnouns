import { Button, FloatingLabel, FormControl, Spinner } from 'react-bootstrap';
import Modal from '../Modal';
import classes from './VoteModal.module.css';
import { useCastVote, useCastVoteWithReason, Vote } from '../../wrappers/nounsDao';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { TransactionStatus } from '@usedapp/core';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import clsx from 'clsx';



interface VoteModalProps {
  show: boolean;
  onHide: () => void;
  proposalId: string | undefined;
  availableVotes: number;
}

const POST_SUCESSFUL_VOTE_MODAL_CLOSE_TIME_MS = 3000;

const VoteModal = ({ show, onHide, proposalId, availableVotes }: VoteModalProps) => {
  const { castVote, castVoteState } = useCastVote();
  const { castVoteWithReason, castVoteWithReasonState } = useCastVoteWithReason();
  const [vote, setVote] = useState<Vote>();
  const [voteReason, setVoteReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoteSucessful, setIsVoteSuccessful] = useState(false);
  const [isVoteFailed, setIsVoteFailed] = useState(false);
  const [failureCopy, setFailureCopy] = useState<ReactNode>('');
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');

  const getVoteErrorMessage = (error: string | undefined) => {
    if (error?.match(/voter already voted/)) {
      return <p>User Already Voted</p>;
    }
    return error;
  };

  const handleVoteStateChange = useCallback((state: TransactionStatus) => {
    switch (state.status) {
      case 'None':
        setIsLoading(false);
        break;
      case 'Mining':
        setIsLoading(true);
        break;
      case 'Success':
        setIsLoading(false);
        setIsVoteSuccessful(true);
        break;
      case 'Fail':
        setFailureCopy(<p>Transaction Failed</p>);
        setErrorMessage(state?.errorMessage || <p>Please try again.</p>);
        setIsLoading(false);
        setIsVoteFailed(true);
        break;
      case 'Exception':
        setFailureCopy(<p>Error</p>);
        setErrorMessage(
          getVoteErrorMessage(state?.errorMessage) || <p>Please try again.</p>,
        );
        setIsLoading(false);
        setIsVoteFailed(true);
        break;
    }
  }, []);

  // Cast vote transaction state hook
  useEffect(() => {
    handleVoteStateChange(castVoteState);
  }, [castVoteState, handleVoteStateChange]);

  // Cast vote with reason transaction state hook
  useEffect(() => {
    handleVoteStateChange(castVoteWithReasonState);
  }, [castVoteWithReasonState, handleVoteStateChange]);

  // Auto close the modal after a transaction completes succesfully
  // Leave failed transaction up until user closes manually to allow for debugging
  useEffect(() => {
    if (isVoteSucessful) {
      setTimeout(onHide, POST_SUCESSFUL_VOTE_MODAL_CLOSE_TIME_MS);
    }
  }, [isVoteSucessful, onHide]);

  // If show is false (i.e. on hide) reset failure related state variables
  useEffect(() => {
    if (show) {
      return;
    }
    setIsVoteFailed(false);
  }, [show]);

  const voteModalContent = (
    <>
      {isVoteSucessful && (
        <div className={classes.transactionStatus}>
          <p>
            <p>
              You've successfully voted on on prop {i18n.number(parseInt(proposalId || '0'))}
            </p>
          </p>

          <div className={classes.voteSuccessBody}>
            <p>Thank you for voting.</p>
          </div>
        </div>
      )}
      {isVoteFailed && (
        <div className={classes.transactionStatus}>
          <p className={classes.voteFailureTitle}>
            <p>There was an error voting for your account.</p>
          </p>
          <div className={classes.voteFailureBody}>
            {failureCopy}: <span className={classes.voteFailureErrorMessage}>{errorMessage}</span>
          </div>
        </div>
      )}
      {!isVoteFailed && !isVoteSucessful && (
        <div className={clsx(classes.votingButtonsWrapper, isLoading ? classes.disabled : '')}>
          <div onClick={() => setVote(Vote.FOR)}>
            <NavBarButton
              buttonText={
                availableVotes > 1 ? (
                  <p>
                    Cast {i18n.number(availableVotes)} votes for Prop{' '}
                    {i18n.number(parseInt(proposalId || '0'))}
                  </p>
                ) : (
                  <p>Cast 1 vote for Prop {i18n.number(parseInt(proposalId || '0'))}</p>
                )
              }
              buttonIcon={<></>}
              buttonStyle={
                vote === Vote.FOR
                  ? NavBarButtonStyle.WHITE_ACTIVE_VOTE_SUBMIT
                  : NavBarButtonStyle.WHITE_INFO
              }
            />
          </div>
          <br />
          <div onClick={() => setVote(Vote.AGAINST)}>
            <NavBarButton
              buttonText={
                availableVotes > 1 ? (
                  <p>
                    Cast {i18n.number(availableVotes)} votes against Prop{' '}
                    {i18n.number(parseInt(proposalId || '0'))}
                  </p>
                ) : (
                  <p>Cast 1 vote against Prop {i18n.number(parseInt(proposalId || '0'))}</p>
                )
              }
              buttonIcon={<></>}
              buttonStyle={
                vote === Vote.AGAINST
                  ? NavBarButtonStyle.WHITE_ACTIVE_VOTE_SUBMIT
                  : NavBarButtonStyle.WHITE_INFO
              }
            />
          </div>
          <br />
          <div onClick={() => setVote(Vote.ABSTAIN)}>
            <NavBarButton
              buttonText={
                <p>
                  Abstain from voting on Prop {i18n.number(parseInt(proposalId || '0'))}
                </p>
              }
              buttonIcon={<></>}
              buttonStyle={
                vote === Vote.ABSTAIN
                  ? NavBarButtonStyle.WHITE_ACTIVE_VOTE_SUBMIT
                  : NavBarButtonStyle.WHITE_INFO
              }
            />
          </div>
          <br />
          <FloatingLabel controlId="reasonTextarea" label={<p>Reason (Optional)</p>}>
            <FormControl
              as="textarea"
              placeholder={
                i18n.locale === 'en' ? `Reason for voting ${Vote[vote ?? Vote.FOR]}` : ''
              }
              value={voteReason}
              onChange={e => setVoteReason(e.target.value)}
              className={classes.voteReasonTextarea}
            />
          </FloatingLabel>
          <br />
          <Button
            onClick={() => {
              if (vote === undefined || !proposalId || isLoading) {
                return;
              }
              setIsLoading(true);
              if (voteReason.trim() === '') {
                castVote(proposalId, vote);
              } else {
                castVoteWithReason(proposalId, vote, voteReason);
              }
            }}
            className={vote === undefined ? classes.submitBtnDisabled : classes.submitBtn}
          >
            {isLoading ? <Spinner animation="border" /> : <p>Submit Vote</p>}
          </Button>
        </div>
      )}
    </>
  );

  // On modal dismiss, reset non-success state
  const resetNonSuccessStateAndHideModal = () => {
    setIsLoading(false);
    setIsVoteFailed(false);
    setErrorMessage('');
    setFailureCopy('');
    onHide();
  };

  return (
    <>
      {show && (
        <Modal
          onDismiss={resetNonSuccessStateAndHideModal}
          title={<p>Vote on Prop {i18n.number(parseInt(proposalId || '0'))}</p>}
          content={voteModalContent}
        />
      )}
    </>
  );
};
export default VoteModal;
