import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/dist/src/signers';
import chai, {expect} from 'chai';
import {solidity} from 'ethereum-waffle';
import {Contract} from 'ethers';
import {ethers, upgrades} from 'hardhat';
import pino from 'pino';
import {
  SimpleTokenAccessControlImpl,
  SimpleTokenAccessControlImpl__factory,
  TimelockController,
  TimelockController__factory,
} from '../../typechain';
import {SimpleTokenAccessControlImplV2__factory} from '../../typechain/factories/SimpleTokenAccessControlImplV2__factory';
import {SimpleTokenAccessControlImplV2} from '../../typechain/SimpleTokenAccessControlImplV2';
import {forwardTimestamp} from '../utils/evm';
chai.use(solidity);

const Logger = pino();

describe('TimeLock with ERC20 access control contract', () => {
  const tokenName = 'MMO';
  const tokenSymbol = 'RPG';

  let SimpleTokenImpl: SimpleTokenAccessControlImpl__factory;
  let simpleTokenImpl: SimpleTokenAccessControlImpl;
  let SimpleTokenImplV2: SimpleTokenAccessControlImplV2__factory;
  let simpleTokenImplV2: SimpleTokenAccessControlImplV2;
  let simpleToken: Contract;
  let Timelock: TimelockController__factory;
  let timelock: TimelockController;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  before('setup accounts', async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  });

  before('fetch contract factories', async () => {
    SimpleTokenImpl = await ethers.getContractFactory(
      'SimpleTokenAccessControlImpl'
    );
    SimpleTokenImplV2 = await ethers.getContractFactory(
      'SimpleTokenAccessControlImplV2'
    );
    Timelock = await ethers.getContractFactory('TimelockController');
  });

  beforeEach(async () => {
    simpleToken = await upgrades.deployProxy(
      SimpleTokenImpl,
      [tokenName, tokenSymbol],
      {
        kind: 'uups',
      }
    );

    timelock = await Timelock.deploy(
      3600 * 10,
      [addr1.address],
      [addr2.address]
    );

    simpleTokenImplV2 = await SimpleTokenImplV2.deploy();
  });

  describe('Transactions', () => {
    it('ImplementationV1 information should be correct', async () => {
      const tokenProxy: SimpleTokenAccessControlImpl =
        simpleToken as SimpleTokenAccessControlImpl;
      expect(await tokenProxy.implementationVersion()).to.equal('1.0.0');
      expect(await tokenProxy.name()).to.equal(tokenName);
      expect(await tokenProxy.symbol()).to.equal(tokenSymbol);
      expect(await tokenProxy.totalSupply()).to.equal(0);
    });

    it('Should fail when call upgrade from address without OPERATOR_ROLE', async () => {
      const tokenProxy: SimpleTokenAccessControlImpl =
        simpleToken as SimpleTokenAccessControlImpl;
      await expect(
        tokenProxy.connect(addr2).upgradeTo(simpleTokenImplV2.address)
      ).to.revertedWith('require admin permission to do upgrades');
    });

    it('Should success when call upgrade from address with OPERATOR_ROLE', async () => {
      const tokenProxy: SimpleTokenAccessControlImpl =
        simpleToken as SimpleTokenAccessControlImpl;

      await tokenProxy.mint(addr1.address, 1);
      expect(await tokenProxy.balanceOf(addr1.address)).to.equal(1);

      await tokenProxy.connect(owner).upgradeTo(simpleTokenImplV2.address);

      const tokenProxyImplV2: SimpleTokenAccessControlImplV2 =
        SimpleTokenAccessControlImplV2__factory.connect(
          tokenProxy.address,
          owner
        );

      expect(await tokenProxyImplV2.implementationVersion()).to.equal('2.0.0');

      expect(await tokenProxyImplV2.balanceOf(addr1.address)).to.equal(1); // state persistent

      expect(await tokenProxyImplV2.newFunction()).to.equal('2.0.0'); // new API
    });

    it('Propose an upgrade transaction and execute it', async () => {
      // Grant operator role to timelock contract
      simpleToken.grantRole(ethers.utils.id('OPERATOR_ROLE'), timelock.address);
      const tokenProxy: SimpleTokenAccessControlImpl =
        simpleToken as SimpleTokenAccessControlImpl;

      // Schedule an upgradeTo transaction
      const data = SimpleTokenImpl.interface.encodeFunctionData('upgradeTo', [
        simpleTokenImplV2.address,
      ]);
      await timelock
        .connect(addr1)
        .schedule(
          tokenProxy.address,
          0,
          data,
          ethers.constants.HashZero,
          ethers.utils.id('salt'),
          3600 * 20
        );

      // Simulate future block
      await forwardTimestamp(ethers.provider, 3600 * 21);

      // Execute job
      await timelock
        .connect(addr2)
        .execute(
          simpleToken.address,
          0,
          data,
          ethers.constants.HashZero,
          ethers.utils.id('salt')
        );

      // Define new proxy contract instance with v2 interface
      const tokenProxyImplV2: SimpleTokenAccessControlImplV2 =
        SimpleTokenAccessControlImplV2__factory.connect(
          tokenProxy.address,
          owner
        );

      // Check V2 state
      expect(await tokenProxyImplV2.implementationVersion()).to.equal('2.0.0');
    });
  });
});
