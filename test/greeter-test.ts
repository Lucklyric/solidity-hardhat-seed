import {expect} from 'chai';
import {ethers} from 'hardhat';
import {Contract, ContractFactory} from 'ethers';
import {SignerWithAddress} from 'hardhat-deploy-ethers/dist/src/signer-with-address';

describe('Tokens', () => {
  let operator: SignerWithAddress;

  before('setup accounts', async () => {
    [operator] = await ethers.getSigners();
  });

  let Greeter: ContractFactory;
  let greeter: Contract;

  before('fetch contract factories', async () => {
    Greeter = await ethers.getContractFactory('Greeter');
  });

  describe('Greeter', () => {
    it("Should return the new greeting once it's changed", async function () {
      greeter = await Greeter.connect(operator).deploy('Hello, world!');

      await greeter.deployed();
      expect(await greeter.greet()).to.equal('Hello, world!');

      await greeter.setGreeting('Hola, mundo!');
      expect(await greeter.greet()).to.equal('Hola, mundo!');
    });
  });
});
