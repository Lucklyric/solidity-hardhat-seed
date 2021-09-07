import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/dist/src/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';
import {Greeter, Greeter__factory} from '../typechain';

describe('Greeter', () => {
  let operator: SignerWithAddress;

  before('setup accounts', async () => {
    [operator] = await ethers.getSigners();
  });

  let Greeter: Greeter__factory;
  let greeter: Greeter;

  before('fetch contract factories', async () => {
    Greeter = await ethers.getContractFactory('Greeter');
  });

  describe('Greeter', () => {
    it("Should return the new greeting once it's changed", async () => {
      greeter = await Greeter.connect(operator).deploy('Hello, world!');

      await greeter.deployed();
      expect(await greeter.greet()).to.equal('Hello, world!');

      await greeter.setGreeting('Hola, mundo!');
      expect(await greeter.greet()).to.equal('Hola, mundo!');
    });
  });
});
