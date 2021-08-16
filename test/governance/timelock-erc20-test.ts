import chai, {expect} from 'chai';
import {ethers} from 'hardhat';
import {BigNumber, ContractFactory} from 'ethers';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/dist/src/signers';
import {
  SimpleToken,
  SimpleTokenAccessControl,
  SimpleTokenAccessControl__factory,
  SimpleToken__factory,
  TimelockController,
  TimelockController__factory,
} from '../../typechain';
import {solidity} from 'ethereum-waffle';
import {formatBytes32String} from 'ethers/lib/utils';
chai.use(solidity);

describe('TimeLock with ERC20 access control contract', function () {
  const initialSupply = 1000000;
  const tokenName = 'MySimpleToken';
  const tokenSymbol = 'MST';

  let SimpleToken: SimpleTokenAccessControl__factory;
  let simpleToken: SimpleTokenAccessControl;
  let Timelock: TimelockController__factory;
  let timelock: TimelockController;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    SimpleToken = await ethers.getContractFactory('SimpleTokenAccessControl');
    Timelock = await ethers.getContractFactory('TimelockController');
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    simpleToken = await SimpleToken.deploy(tokenName, tokenSymbol);
    timelock = await Timelock.deploy(
      3600 * 10,
      [addr1.address],
      [addr2.address]
    );

    simpleToken.grantRole(ethers.utils.id('MINTER_ROLE'), timelock.address);
  });

  describe('Transactions', function () {
    it('Grant timelock mint permission', async function () {
      const data = SimpleToken.interface.encodeFunctionData('mint', [
        addr1.address,
        BigNumber.from(100),
      ]);
      console.log(data);
      await timelock
        .connect(addr1)
        .schedule(
          simpleToken.address,
          0,
          data,
          ethers.constants.HashZero,
          ethers.utils.id('salt'),
          3600 * 20
        );
      await ethers.provider.send('evm_increaseTime', [3600 * 100]);
      await ethers.provider.send('evm_mine', []);
      await ethers.provider.getBlock('latest');

      expect(await simpleToken.balanceOf(addr1.address)).to.equal(0);
      await timelock
        .connect(addr2)
        .execute(
          simpleToken.address,
          0,
          data,
          ethers.constants.HashZero,
          ethers.utils.id('salt')
        );
      expect(await simpleToken.balanceOf(addr1.address)).to.equal(100);
    });
  });
});
