import {ethers, upgrades} from 'hardhat';

async function main() {
  const GreeterUpgradeable = await ethers.getContractFactory(
    'GreeterUpgradeable'
  );
  const greeter = await upgrades.deployProxy(GreeterUpgradeable, ['GU']);
  await greeter.deployed();
  console.log('Box deployed to:', greeter.address);
}

main();
