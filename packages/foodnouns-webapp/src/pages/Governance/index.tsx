import { Col, Row } from 'react-bootstrap';
import Section from '../../layout/Section';
import { useAllProposals, useProposalThreshold } from '../../wrappers/nounsDao';
import Proposals from '../../components/Proposals';
import classes from './Governance.module.css';
import { utils } from 'ethers/lib/ethers';
import clsx from 'clsx';
import { useTreasuryBalance, useTreasuryUSDValue } from '../../hooks/useTreasuryBalance';



const GovernancePage = () => {
  const { data: proposals } = useAllProposals();
  const threshold = useProposalThreshold();
  const nounsRequired = threshold !== undefined ? threshold + 1 : '...';

  const treasuryBalance = useTreasuryBalance();
  const treasuryBalanceUSD = useTreasuryUSDValue();

  // Note: We have to extract this copy out of the <span> otherwise the Lingui macro gets confused
  const nounSingular = <p>FOODNOUN</p>;
  const nounPlural = <p>FOODNOUNS</p>;

  return (
    <Section fullWidth={false} className={classes.section}>
      <Col lg={10} className={classes.wrapper}>
        <Row className={classes.headerRow}>
          <span>
            <p>Governance</p>
          </span>
          <h1>
            <p>FOODNOUNS DAO</p>
          </h1>
        </Row>
        <p className={classes.subheading}>
          <p>
            FOODNOUNS govern <span className={classes.boldText}>FOODNOUNS DAO</span>. FOODNOUNS can
            vote on proposals or delegate their vote to a third party. A minimum of{' '}
            <span className={classes.boldText}>
              {nounsRequired} {threshold === 0 ? nounSingular : nounPlural}
            </span>{' '}
            is required to submit proposals.
          </p>
        </p>

        <Row className={classes.treasuryInfoCard}>
          <Col lg={8} className={classes.treasuryAmtWrapper}>
            <Row className={classes.headerRow}>
              <span>
                <p>Treasury</p>
              </span>
            </Row>
            <Row>
              <Col className={clsx(classes.ethTreasuryAmt)} lg={3}>
                <h1 className={classes.ethSymbol}>Ξ</h1>
                <h1>
                  {treasuryBalance &&
                    i18n.number(Number(Number(utils.formatEther(treasuryBalance)).toFixed(3)))}
                </h1>
              </Col>
              <Col className={classes.usdTreasuryAmt}>
                <h1 className={classes.usdBalance}>
                  {treasuryBalanceUSD &&
                    i18n.number(Number(treasuryBalanceUSD.toFixed(2)), {
                      style: 'currency',
                      currency: 'USD',
                    })}
                </h1>
              </Col>
            </Row>
          </Col>
          <Col className={classes.treasuryInfoText}>
            <p>
              This treasury exists for <span className={classes.boldText}>FOODNOUNS DAO</span>{' '}
              participants to allocate resources for the long-term growth and prosperity of the
              FOODNOUNS project.
            </p>
          </Col>
        </Row>
        <Proposals proposals={proposals} />
      </Col>
    </Section>
  );
};
export default GovernancePage;
