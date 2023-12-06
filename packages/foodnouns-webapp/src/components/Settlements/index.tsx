import classes from './Settlements.module.css';
import Section from '../../layout/Section';
import { useQuery } from '@apollo/client';
import { settlements } from '../../wrappers/subgraph';
import { ethers } from 'ethers';
import { useCoingeckoPrice } from '@usedapp/coingecko';
import ShortAddress from '../ShortAddress';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import Link from '../Link';
import { Table } from 'react-bootstrap';

interface SettlementsPageProps {
  tops?: number;
}

const Settlements: React.FC<SettlementsPageProps> = props => {
  const { tops } = props;
  const isMobile = window.innerWidth < 992;
  const { loading, error, data } = useQuery(settlements(tops || 10));

  const etherPrice = Number(useCoingeckoPrice('ethereum', 'usd'));

  if (loading) {
    return (
      <div>
        <b>loading...</b>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <b>error...</b>
      </div>
    );
  }

  return (
    <Section fullWidth={false} className={classes.wrapper}>
      <div style={{ textAlign: 'center' }}>
        <h1>FOODNOUNS DAO</h1>
        <h2>Settlement Tracker</h2>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Table borderless style={{ alignSelf: 'center', width: 800 }}>
          <tr>
            <th>#</th>
            <th>Rank</th>
            <th style={{ textAlign: 'center' }}>#Settled</th>
            <th style={{ textAlign: 'center' }}>%Settled</th>
            <th style={{ textAlign: 'center' }}>Total ETH</th>
            <th style={{ textAlign: 'center' }}>Total $</th>
          </tr>

          {data.accounts.map((item: any, index: number) => (
            <tr>
              <td>{index + 1}</td>
              <td>
                <ShortAddress
                  address={item.id}
                  avatar={isMobile ? false : true}
                  link={buildEtherscanAddressLink(item.id)}
                />
              </td>
              <td style={{ textAlign: 'center' }}>{item.settlementCount}</td>
              <td style={{ textAlign: 'center' }}>
                {(
                  (item.totalSettlementFee / data.governances[0]?.totalSettlementFee) *
                  100
                ).toFixed(2)}{' '}
                %
              </td>
              <td style={{ textAlign: 'center' }}>
                {ethers.utils.formatEther(item.totalSettlementFee).substring(0, 5)}
              </td>
              <td style={{ textAlign: 'center' }}>
                {(Number(ethers.utils.formatEther(item.totalSettlementFee)) * etherPrice).toFixed(
                  2,
                )}
              </td>
            </tr>
          ))}
        </Table>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Link text=">>> See All Settlements <<<" url="/settlements" leavesPage={false} />
      </div>
    </Section>
  );
};
export default Settlements;
