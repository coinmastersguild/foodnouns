// import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';

task('unpause', 'Unpause autction house')
  .addOptionalParam(
    'nounsAuctionHouseProxy',
    'The `NounsAuctionHouse` contract address',
    '0xfAa4bbe589a39745833e2BecE8d401b6195A07b1',
    types.string,
  )
  .setAction(async ({ nounsAuctionHouseProxy }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('NounsAuctionHouse');
    const nftContract = nftFactory.attach(nounsAuctionHouseProxy);

    const receipt = await (
      await nftContract.transferOwnership('0xaF1BFd8bF02C5EC169d20faba53BF0fa761bf65f', {
        gasLimit: 9000000,
      })
    ).wait();
    if (!receipt.events?.length) {
      throw new Error('Failed to unpause');
    }
    console.log('Auction house unpaused');
  });
