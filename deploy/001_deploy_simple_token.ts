import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {BigNumber, Contract, ContractFactory} from 'ethers';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, execute, read, log} = deployments;

  const {deployer} = await getNamedAccounts();

  log({deployer});
  await deploy('SimpleToken', {
    from: deployer,
    args: [BigNumber.from('1000000000000'), 'Simple', 'SIM'],
    log: true,
    deterministicDeployment: false,
  });

  const TokenContract = await hre.ethers.getContract('SimpleToken', deployer);
  const balance = (
    await TokenContract.connect(deployer).balanceOf(deployer)
  ).toString();
  log({balance}, `${deployer}`);

  const totalSupply = (await read('SimpleToken', 'totalSupply')).toString();
  log({totalSupply});
};
export default func;
