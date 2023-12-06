import { useEtherBalance } from '@usedapp/core';
import useLidoBalance from './useLidoBalance';
import { useCoingeckoPrice } from '@usedapp/coingecko';
import config from '../config';
import { ethers } from 'ethers';
import { useQuery } from '@apollo/client';
import { totalBid } from '../wrappers/subgraph';

/**
 * Computes treasury balance (ETH + Lido)
 *
 * @returns Total balance of treasury (ETH + Lido) as EthersBN
 */
export const useTreasuryBalance = () => {
  const ethBalance = useEtherBalance(config.addresses.nounsDaoExecutor);
  const lidoBalanceAsETH = useLidoBalance();
  return ethBalance && lidoBalanceAsETH && ethBalance.add(lidoBalanceAsETH);
};

/**
 * Computes treasury usd value of treasury assets (ETH + Lido) at current ETH-USD exchange rate
 *
 * @returns USD value of treasury assets (ETH + Lido) at current exchange rate
 */
export const useTreasuryUSDValue = () => {
  const etherPrice = Number(useCoingeckoPrice('ethereum', 'usd'));
  const treasuryBalanceETH = Number(
    ethers.utils.formatEther(useTreasuryBalance()?.toString() || '0'),
  );
  return etherPrice * treasuryBalanceETH;
};

export const useContributionsBalance = () => {
  const { data } = useQuery(totalBid());
  const ethBalance = Number(
    ethers.utils.formatEther(data?.governances[0]?.totalBid?.toString() || 0),
  );
  return ethBalance * 0.25;
};

export const useContributionsUSDValue = () => {
  const etherPrice = Number(useCoingeckoPrice('ethereum', 'usd'));
  const contributionsBalanceETH = useContributionsBalance();
  return etherPrice * contributionsBalanceETH;
};
