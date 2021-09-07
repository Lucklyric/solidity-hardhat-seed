import {JsonRpcProvider} from '@ethersproject/providers';
import {ethers} from 'ethers';

export const forwardTimestamp = async (
  provider: JsonRpcProvider,
  time: number
): Promise<void> => {
  await provider.send('evm_increaseTime', [time]);
  await provider.send('evm_mine', []);
  await provider.getBlock('latest');
}; // forward time
