import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {BigNumber, Contract, ContractFactory} from 'ethers';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // !!! Hardhat-Deploy not support well for OpenZeppelinTransparentProxy, use scripts or tasks instead
  //   const {deployments, getNamedAccounts} = hre;
  //   const {deploy, execute, read, log} = deployments;
  //
  //   const {deployer} = await getNamedAccounts();
  //
  //   log({deployer});
  //   await deploy('GreeterUpgradeable', {
  //     contract: 'GreeterUpgradeable',
  //     from: deployer,
  //     args: ['GU'],
  //     log: true,
  //     proxy: {
  //       owner: deployer,
  //       proxyContract: 'OpenZeppelinTransparentProxy',
  //       methodName: 'initialize',
  //     },
  //     deterministicDeployment: false,
  //   });
  //
  //   const GreeterDeploy = await deployments.get('GreeterUpgradeable'); // Token is available because the fixture was executed
  //   // const Greeter = await hre.ethers.getContractFactory('GreeterUpgradeable');
  //   // const greet = Greeter.attach(GreeterDeploy.address).connect(deployer)
  //   // console.log(await greet.greet());
  //
  //   await deploy('GreeterUpgradeable', {
  //     contract: 'GreeterUpgradeableImplv2',
  //     from: deployer,
  //     log: true,
  //     proxy: {
  //       owner: deployer,
  //       proxyContract: 'OpenZeppelinTransparentProxy',
  //     },
  //     deterministicDeployment: false,
  //   });
  //
  //   await execute(
  //     'GreeterUpgradeable',
  //     {
  //       from: deployer,
  //       log: true,
  //     },
  //     'setCount',
  //     1
  //   );
  //
  //   const GreeterV2 = await hre.ethers.getContractFactory(
  //     'GreeterUpgradeableImplv2'
  //   );
  //   const greetV2 = GreeterV2.attach(GreeterDeploy.address).connect(deployer);
  //   console.log(await greetV2.greet());
  //   console.log(await greetV2.count());
  //   console.log(await greetV2.count2());
  //   console.log(await greetV2.getCount());
};
export default func;
