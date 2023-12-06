import classes from './Contribution.module.css';
import Section from '../../layout/Section';
import { useContributionsBalance, useContributionsUSDValue } from '../../hooks/useTreasuryBalance';
import { i18n } from '@lingui/core';

const Contribution = () => {
  const contributionsBalance = useContributionsBalance();
  const contributionsUSDValue = useContributionsUSDValue();

  return (
    <Section fullWidth={false} className={classes.wrapper}>
      <div className={classes.box}>
        <h1>Total Contributions to NounsDAO</h1>
        <h2>
          FOODNOUNS DAO automatically and trustlessly sends 25% of all auction proceeds to NounsDAO
          treasury contract....forever. We are honored to be a premier subDAO and member of the
          larger nounish ecosystem.
        </h2>
        <h1 style={{ font: 'PT ROOT UI', fontFamily: 'PT ROOT UI' }}>
          <b>
            Ξ {contributionsBalance && i18n.number(contributionsBalance)} |{' '}
            {contributionsUSDValue &&
              i18n.number(Number(contributionsUSDValue.toFixed(2)), {
                style: 'currency',
                currency: 'USD',
              })}
          </b>
        </h1>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}></div>
    </Section>
  );
};
export default Contribution;
