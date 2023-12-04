import { ContractAddresses } from './types';
import foodNounAddresses from './foodnouns-addresses.json';

// nouns contracts,  hardcoded Dec 2, 2023
const nounsAddresses: Record<string, ContractAddresses> = JSON.parse(`{
  "1": {
    "nounsToken": "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
    "nounsSeeder": "0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515",
    "nounsDescriptor": "0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63",
    "nftDescriptor": "0x0BBAd8c947210ab6284699605ce2a61780958264",
    "nounsAuctionHouse": "0xF15a943787014461d94da08aD4040f79Cd7c124e",
    "nounsAuctionHouseProxy": "0x830BD73E4184ceF73443C15111a1DF14e495C706",
    "nounsAuctionHouseProxyAdmin": "0xC1C119932d78aB9080862C5fcb964029f086401e",
    "nounsDaoExecutor": "0x0BC3807Ec262cB779b38D65b38158acC3bfedE10",
    "nounsDaoExecutorV2": "0x0FB7CF84F171154cBC3F553aA9Df9b0e9076649D",
    "nounsDaoExecutorProxy": "0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71",
    "nounsDAOProxy": "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d",
    "nounsDAOLogicV1": "0xa43aFE317985726E4e194eb061Af77fbCb43F944",
    "nounsDAOLogicV2": "0x51C7D7C47E440d937208bD987140D6db6B1E4051",
    "nounsDAOData": "0xf790A5f59678dd733fb3De93493A91f472ca1365"
  },
  "4": {
    "nounsToken": "0x65dA5EbD09f0C6CA1DFc5EaA5639626ccd5DaD06",
    "nounsSeeder": "0x62F257406e9C1752c65d60ADF5D283FEe55C6301",
    "nounsDescriptor": "0x8B7Ec9f2ad70C10F4Ba5D352D6691B9BFF2F628b",
    "nftDescriptor": "0xc905C0c663394181F44809854497D8783b743A21",
    "nounsAuctionHouse": "0xF2d27387353161d77FCD918E7f4DE07A5f77aba3",
    "nounsAuctionHouseProxy": "0xDAF873A2Ae77D570da094B52A8eC50Ef8885b2c4",
    "nounsAuctionHouseProxyAdmin": "0xFE3347665088A7933044941822e6e46EF70771f8",
    "nounsDaoExecutor": "0x06C0BaC8E6a697eC883372d3e9Db9B200fF93C03",
    "nounsDAOProxy": "0xF5ab6f74c557c6e8B96EeF0371F9CfCf9F5e4b26",
    "nounsDAOLogicV2": "0x27c9e62fc1F1334eb2A090506675Ec31df878E00"
  },
  "5": {
    "nounsToken": "0x99265CE0983aab76F5a3789663FDD887dE66638A",
    "nounsSeeder": "0x3947Ffe80005DAf485FbD37A52F2d4322De10c0D",
    "nounsDescriptor": "0xC5FcAAb38C4Ab043e2706f245183d747299dF414",
    "nftDescriptor": "0xC6736a2c6aB54D6DFd9787F2335282CBF51135a0",
    "nounsAuctionHouse": "0xd329a604EFEE29799E821A3980620fbD1c1bBA40",
    "nounsAuctionHouseProxy": "0x32bBBf3721a1b05390daf4Dec2f5Fe4b935f25A1",
    "nounsAuctionHouseProxyAdmin": "0x5dAdD045E2aC09f55f49Bb84886Ea7724c675a0d",
    "nounsDaoExecutor": "0xc15008dE43D93D115BD64ED4D95817fFdBfb6DEA",
    "nounsDAOProxy": "0x22F7658f64be277e6b3968ecE7b773b092a39864",
    "nounsDAOLogicV2": "0x3c793c2D7Cfd48046c75c63E43d36a2cB42fC649",
    "nounsDAOData": "0xc0217355376E414a1c33Dc3558A75625c5444006"
  },
  "31337": {
    "nounsToken": "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853",
    "nounsSeeder": "0x0165878a594ca255338adfa4d48449f69242eb8f",
    "nounsDescriptor": "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9",
    "nftDescriptor": "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
    "nounsAuctionHouse": "0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6",
    "nounsAuctionHouseProxy": "0x610178da211fef7d417bc0e6fed39f05609ad788",
    "nounsAuctionHouseProxyAdmin": "0x8a791620dd6260079bf849dc5567adc3f2fdc318",
    "nounsDaoExecutor": "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1",
    "nounsDAOProxy": "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f",
    "nounsDAOLogicV2": "0x959922be3caee4b8cd9a407cc3ac1c251c2007b1",
    "nounsDAOData": "0x09635F643e140090A9A8Dcd712eD6285858ceBef"
  },
  "11155111": {
    "nounsToken": "0x4C4674bb72a096855496a7204962297bd7e12b85",
    "nounsSeeder": "0xe99b8Ee07B28C587B755f348649f3Ee45aDA5E7D",
    "nounsDescriptor": "0x5319dbcb313738aD70a3D945E61ceB8b84691928",
    "nftDescriptor": "0xF5A7A2f948b6b2B1BD6E25C6ddE4dA892301caB5",
    "nounsAuctionHouse": "0x44FeBD884Abf796d2d198974A768CBD882a959a8",
    "nounsAuctionHouseProxy": "0x488609b7113FCf3B761A05956300d605E8f6BcAf",
    "nounsAuctionHouseProxyAdmin": "0x9A19E520d9cd6c40eCc79623f16390a68962b7E9",
    "nounsDaoExecutor": "0x332db58b51393f3a6b28d4DD8964234967e1aD33",
    "nounsDaoExecutorProxy": "0x07e5D6a1550aD5E597A9b0698A474AA080A2fB28",
    "nounsDAOProxy": "0x35d2670d7C8931AACdd37C89Ddcb0638c3c44A57",
    "nounsDAOLogicV2": "0x1634D5abB2c0BBF7B817b791C8355a39f2EcEF0A",
    "nounsDAOData": "0x9040f720AA8A693F950B9cF94764b4b06079D002"
  }
}`)


/**
 * Get addresses of contracts that have been deployed to the
 * Ethereum mainnet or a supported testnet. Throws if there are
 * no known contracts deployed on the corresponding chain.
 * @param chainId The desired chainId
 * @param foodnouns The desired defaults to true, otherwise you get nouns.wtf associated contract addresses
 */
export const getContractAddressesForChainOrThrow = (chainId: number, foodnouns = true): ContractAddresses => {
  const _addresses: Record<string, ContractAddresses> = foodnouns ? foodNounAddresses : nounsAddresses;
  if (!_addresses[chainId]) {
    throw new Error(
      `Unknown chain id (${chainId}). No known contracts have been deployed on this chain.`,
    );
  }
  return _addresses[chainId];
};
