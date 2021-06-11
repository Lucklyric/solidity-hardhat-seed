import {ethers, upgrades} from 'hardhat';

async function main() {
  const GreeterUpgradeableV2 = await ethers.getContractFactory(
    'GreeterUpgradeableImplv2'
  );
  const greeter = await upgrades.upgradeProxy(
    '0x38A70c040CA5F5439ad52d0e821063b0EC0B52b6',
    GreeterUpgradeableV2
  );
  console.log('Greeter Upgrded');
  console.log(await greeter.greet());
  console.log(await greeter.count());
}

main();
