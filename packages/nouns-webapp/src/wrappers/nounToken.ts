import { useContractCall, useContractFunction, useEthers } from '@usedapp/core';
import { BigNumber as EthersBN, ethers, utils } from 'ethers';
import { NounsTokenABI, NounsTokenFactory } from '@nouns/contracts';
import config, { cache, cacheKey, CHAIN_ID } from '../config';
import { useQuery } from '@apollo/client';
import { clientFactory, seedsQuery } from './subgraph';
import { useEffect } from 'react';
import { nounclient } from '..';

interface NounToken {
  name: string;
  description: string;
  image: string;
}

export interface INounSeed {
  accessory: number;
  background: number;
  body: number;
  glasses: number;
  head: number;
}

export enum NounsTokenContractFunction {
  delegateVotes = 'votesToDelegate',
}

const abi = new utils.Interface(NounsTokenABI);
const seedCacheKey = cacheKey(cache.seed, CHAIN_ID, config.addresses.nounsToken);
const nounsSeedCacheKey = cacheKey(cache.nounseed, CHAIN_ID, config.addresses.nounsToken);

const isSeedValid = (seed: Record<string, any> | undefined) => {
  const expectedKeys = ['background', 'body', 'accessory', 'head', 'glasses'];
  const hasExpectedKeys = expectedKeys.every(key => (seed || {}).hasOwnProperty(key));
  const hasValidValues = Object.values(seed || {}).some(v => v !== 0);
  return hasExpectedKeys && hasValidValues;
};

export const useNounToken = (nounId: EthersBN) => {
  const [noun] =
    useContractCall<[string]>({
      abi,
      address: config.addresses.nounsToken,
      method: 'dataURI',
      args: [nounId],
    }) || [];

  if (!noun) {
    return;
  }

  const nounImgData = noun.split(';base64,').pop() as string;
  const json: NounToken = JSON.parse(atob(nounImgData));

  return json;
};

const seedArrayToObject = (seeds: (INounSeed & { id: string })[]) => {
  return seeds.reduce<Record<string, INounSeed>>((acc, seed) => {
    acc[seed.id] = {
      background: Number(seed.background),
      body: Number(seed.body),
      accessory: Number(seed.accessory),
      head: Number(seed.head),
      glasses: Number(seed.glasses),
    };
    return acc;
  }, {});
};


export const useNounSeeds = (isNoun: boolean) => {
  const cache = isNoun ? localStorage.getItem(nounsSeedCacheKey) : localStorage.getItem(seedCacheKey);
  const cachedSeeds = cache ? JSON.parse(cache) : undefined;

  const { data: nounsData } = useQuery(seedsQuery(), { client: nounclient });
  const { data: foodNounsData } = useQuery(seedsQuery());

  useEffect(() => {
    if (!cachedSeeds && isNoun && nounsData?.seeds?.length) {
      const seeds = [...nounsData.seeds];
      localStorage.setItem(nounsSeedCacheKey, JSON.stringify(seedArrayToObject(seeds)));
    }
  }, [cachedSeeds, isNoun, nounsData]);

  useEffect(() => {
    if (!cachedSeeds && isNoun && foodNounsData?.seeds?.length) {
      const seeds = [...foodNounsData.seeds];
      localStorage.setItem(seedCacheKey, JSON.stringify(seedArrayToObject(seeds)));
    }
  }, [cachedSeeds, foodNounsData, isNoun]);

  return cachedSeeds;
};

export const useNounSeed = (nounId: EthersBN, isNoun: boolean) => {
  const seeds = useNounSeeds(isNoun);
  const seed = seeds?.[nounId.toString()];

  const request = seed ? false : {
    abi,
    address: config.addresses.nounsToken,
    method: 'seeds',
    args: [nounId],
  };
  const response = useContractCall<INounSeed>(request) || seed;
  if (response) {
    const seedCache = localStorage.getItem(seedCacheKey);
    if (seedCache && isSeedValid(response)) {
      const updatedSeedCache = JSON.stringify({
        ...JSON.parse(seedCache),
        [nounId.toString()]: {
          accessory: response.accessory,
          background: response.background,
          body: response.body,
          glasses: response.glasses,
          head: response.head,
        },
      });
      localStorage.setItem(seedCacheKey, updatedSeedCache);
    }
    return response;
  }
  return seed;
};

export const useUserVotes = (): number | undefined => {
  const { account } = useEthers();
  return useAccountVotes(account ?? ethers.constants.AddressZero);
};

export const useAccountVotes = (account?: string): number | undefined => {
  const [votes] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.nounsToken,
      method: 'getCurrentVotes',
      args: [account],
    }) || [];
  return votes?.toNumber();
};

export const useUserDelegatee = (): string | undefined => {
  const { account } = useEthers();
  const [delegate] =
    useContractCall<[string]>({
      abi,
      address: config.addresses.nounsToken,
      method: 'delegates',
      args: [account],
    }) || [];
  return delegate;
};

export const useUserVotesAsOfBlock = (block: number | undefined): number | undefined => {
  const { account } = useEthers();

  // Check for available votes
  const [votes] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.nounsToken,
      method: 'getPriorVotes',
      args: [account, block],
    }) || [];
  return votes?.toNumber();
};

export const useDelegateVotes = () => {
  const nounsToken = new NounsTokenFactory().attach(config.addresses.nounsToken);

  // @ts-ignore
  const { send, state } = useContractFunction(nounsToken, 'delegate');

  return { send, state };
};

export const useNounTokenBalance = (address: string): number | undefined => {
  const [tokenBalance] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.nounsToken,
      method: 'balanceOf',
      args: [address],
    }) || [];
  return tokenBalance?.toNumber();
};

export const useUserNounTokenBalance = (): number | undefined => {
  const { account } = useEthers();

  const [tokenBalance] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.nounsToken,
      method: 'balanceOf',
      args: [account],
    }) || [];
  return tokenBalance?.toNumber();
};
