import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/dist/src/signers';
import chai, {expect} from 'chai';
import {solidity} from 'ethereum-waffle';
import {ethers, upgrades} from 'hardhat';
import {GreeterImplV2__factory} from '../../typechain/factories/GreeterImplV2__factory';
import {GreeterImpl__factory} from '../../typechain/factories/GreeterImpl__factory';
import {GreeterImpl} from '../../typechain/GreeterImpl';
import {GreeterImplV2} from '../../typechain/GreeterImplV2';

chai.use(solidity);
describe('GreeterUpgradeable', () => {
  let operator: SignerWithAddress;

  before('setup accounts', async () => {
    [operator] = await ethers.getSigners();
  });

  let Greeter: GreeterImpl__factory;
  let greeter: GreeterImpl;
  let GreeterV2: GreeterImplV2__factory;
  let greeterV2: GreeterImplV2;

  before('fetch contract factories', async () => {
    Greeter = await ethers.getContractFactory('GreeterImpl');
    GreeterV2 = await ethers.getContractFactory('GreeterImplV2');
  });

  describe('Greeter', () => {
    it("Should return the new greeting once it's changed", async () => {
      greeter = (await upgrades.deployProxy(Greeter, ['Hello, world!'], {
        kind: 'uups',
      })) as unknown as GreeterImpl;

      expect(await greeter.greet()).to.equal('Hello, world!');

      await greeter.setGreeting('Hola, mundo!');
      expect(await greeter.greet()).to.equal('Hola, mundo!');
    });

    it('Upgrade to a v2 implementation', async () => {
      greeterV2 = (await upgrades.upgradeProxy(
        greeter.address,
        GreeterV2
      )) as unknown as GreeterImplV2;
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
