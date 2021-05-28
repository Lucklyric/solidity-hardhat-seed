import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {BigNumber, Contract, ContractFactory} from 'ethers';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, execute, read, log} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('Greeter', {
    from: deployer,
    args: ['hello world'],
    log: true,
    deterministicDeployment: true,
  });

  const copyResult = await deploy('Greeter', {
    from: deployer,
    args: ['hello world'],
    log: true,
    deterministicDeployment: true,
  });

  let currentGreeting = await read('Greeter', 'greet');
  log({currentGreeting});

  if (!hre.network.live) {
    await execute(
      'Greeter',
      {from: deployer, log: true},
      'setGreeting',
      'update1'
    );
  }
  const blockTag = await hre.ethers.provider.getBlockNumber();
  currentGreeting = await read('Greeter', 'greet');
  log({currentGreeting});
  log('try ethers way');

  const TokenContract = await hre.ethers.getContract('Greeter', deployer);
  currentGreeting = await TokenContract.greet();
  log({currentGreeting});
  await TokenContract.setGreeting('update2');
  currentGreeting = await TokenContract.greet();
  log({currentGreeting});
  currentGreeting = await TokenContract.greet({blockTag});
  log({currentGreeting}, `at block: ${blockTag}`);
};
export default func;
