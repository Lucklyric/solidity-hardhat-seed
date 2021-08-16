import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/dist/src/signers';
import chai, {expect} from 'chai';
import {solidity} from 'ethereum-waffle';
import {ethers, upgrades} from 'hardhat';
import {GreeterUpgradeable, GreeterUpgradeableImplv2} from '../../typechain';
import {GreeterUpgradeableImplV2__factory} from '../../typechain/factories/GreeterUpgradeableImplV2__factory';
import {GreeterUpgradeableImpl__factory} from '../../typechain/factories/GreeterUpgradeableImpl__factory';
import {GreeterUpgradeableImpl} from '../../typechain/GreeterUpgradeableImpl';
import {GreeterUpgradeableImplV2} from '../../typechain/GreeterUpgradeableImplV2';

chai.use(solidity);
describe('GreeterUpgradeable', () => {
  let operator: SignerWithAddress;

  before('setup accounts', async () => {
    [operator] = await ethers.getSigners();
  });

  let Greeter: GreeterUpgradeableImpl__factory;
  let greeter: GreeterUpgradeableImpl;
  let GreeterV2: GreeterUpgradeableImplV2__factory;
  let greeterV2: GreeterUpgradeableImplV2;

  before('fetch contract factories', async () => {
    Greeter = await ethers.getContractFactory('GreeterUpgradeableImpl');
    GreeterV2 = await ethers.getContractFactory('GreeterUpgradeableImplV2');
  });

  describe('Greeter', () => {
    it("Should return the new greeting once it's changed", async () => {
      greeter = (await upgrades.deployProxy(Greeter, ['Hello, world!'], {
        kind: 'uups',
      })) as unknown as GreeterUpgradeableImpl;

      expect(await greeter.greet()).to.equal('Hello, world!');

      await greeter.setGreeting('Hola, mundo!');
      expect(await greeter.greet()).to.equal('Hola, mundo!');
    });

    it('Upgrade to a v2 implementation', async () => {
      greeterV2 = (await upgrades.upgradeProxy(
        greeter.address,
        GreeterV2
      )) as unknown as GreeterUpgradeableImplv2;
    });

    it('V2 keeps V1 states', async () => {
      expect(await greeterV2.greet()).to.equal('Hola, mundo!');
    });

    it('V2 supports new state and interface', async () => {
      await greeterV2.setCount(3);
      expect(await greeterV2.getCount()).to.equal(3 + 3 * 2);
    });
  });
});
