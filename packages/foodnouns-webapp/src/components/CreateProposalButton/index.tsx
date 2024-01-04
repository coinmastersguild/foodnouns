import { Button, Spinner } from 'react-bootstrap';



const CreateProposalButton = ({
  className,
  isLoading,
  proposalThreshold,
  hasActiveOrPendingProposal,
  hasEnoughVote,
  isFormInvalid,
  handleCreateProposal,
}: {
  className?: string;
  isLoading: boolean;
  proposalThreshold?: number;
  hasActiveOrPendingProposal: boolean;
  hasEnoughVote: boolean;
  isFormInvalid: boolean;
  handleCreateProposal: () => void;
}) => {
  const buttonText = () => {
    if (hasActiveOrPendingProposal) {
      return <p>You already have an active or pending proposal</p>;
    }
    if (!hasEnoughVote) {
      if (proposalThreshold) {
        return (
          <p>
            You must have {i18n.number(proposalThreshold || 0 + 1)} votes to submit a proposal
          </p>
        );
      }
      return <p>You don't have enough votes to submit a proposal</p>;
    }
    return <p>Create Proposal</p>;
  };

  return (
    <div className="d-grid gap-2">
      <Button
        className={className}
        variant={hasActiveOrPendingProposal || !hasEnoughVote ? 'danger' : 'primary'}
        disabled={isFormInvalid || hasActiveOrPendingProposal || !hasEnoughVote}
        onClick={handleCreateProposal}
      >
        {isLoading ? <Spinner animation="border" /> : buttonText()}
      </Button>
    </div>
  );
};
export default CreateProposalButton;
