import chai, {expect} from 'chai';
import {ethers, upgrades} from 'hardhat';
import {Contract, ContractFactory, BigNumber} from 'ethers';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/dist/src/signers';
import {solidity} from 'ethereum-waffle';
import {GreeterUpgradeable, GreeterUpgradeableImplv2} from '../../typechain';

chai.use(solidity);
describe('GreeterUpgradeable', () => {
  let operator: SignerWithAddress;

  before('setup accounts', async () => {
    [operator] = await ethers.getSigners();
  });

  let Greeter: ContractFactory;
  let greeter: GreeterUpgradeable;
  let GreeterV2: ContractFactory;
  let greeterV2: GreeterUpgradeableImplv2;

  before('fetch contract factories', async () => {
    Greeter = await ethers.getContractFactory('GreeterUpgradeable');
    GreeterV2 = await ethers.getContractFactory('GreeterUpgradeableImplv2');
  });

  describe('Greeter', () => {
    it("Should return the new greeting once it's changed", async function () {
      greeter = (await upgrades.deployProxy(Greeter, [
        'Hello, world!',
      ])) as unknown as GreeterUpgradeable;

      expect(await greeter.greet()).to.equal('Hello, world!');

      await greeter.setGreeting('Hola, mundo!');
      expect(await greeter.greet()).to.equal('Hola, mundo!');
    });

    it('Upgrade to a v2 implementation', async function () {
      greeterV2 = (await upgrades.upgradeProxy(
        greeter.address,
        GreeterV2
      )) as unknown as GreeterUpgradeableImplv2;
    });
    it('V2 keeps V1 states', async function () {
      expect(await greeterV2.greet()).to.equal('Hola, mundo!');
    });
    it('V2 supports new state and interface', async function () {
      await greeterV2.setCount(3);
      expect(await greeterV2.getCount()).to.equal(3 + 3 * 2);
    });
  });
});
