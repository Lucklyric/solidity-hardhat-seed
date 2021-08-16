import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/dist/src/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';
import {SimpleToken, SimpleToken__factory} from '../../typechain';

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe('Token contract', function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  const initialSupply = 1000000;
  const tokenName = 'MySimpleToken';
  const tokenSymbol = 'MST';

  let SimpleToken: SimpleToken__factory;
  let simpleToken: SimpleToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async () => {
    // Get the ContractFactory and Signers here.
    SimpleToken = await ethers.getContractFactory('SimpleToken');
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    simpleToken = await SimpleToken.deploy(
      initialSupply,
      tokenName,
      tokenSymbol
    );
  });

  // You can nest describe calls to create subsections.
  describe('Deployment', () => {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it('Should set the right name', async () => {
      // Expect receives a value, and wraps it in an Assertion object. These
      // objects have a lot of utility methods to assert values.
      expect(await simpleToken.name()).to.equal(tokenName);
    });

    // If the callback function is async, Mocha will `await` it.
    it('Should set the right symbol', async () => {
      expect(await simpleToken.symbol()).to.equal(tokenSymbol);
    });

    it('Should assign the total supply of tokens to the owner', async () => {
      const ownerBalance = await simpleToken.balanceOf(owner.address);
      expect(await simpleToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe('Transactions', () => {
    it('Should transfer tokens between accounts', async () => {
      // Transfer 50 tokens from owner to addr1
      await simpleToken.transfer(addr1.address, 50);
      const addr1Balance = await simpleToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await simpleToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await simpleToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it('Should fail if sender doesn’t have enough tokens', async () => {
      const initialOwnerBalance = await simpleToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        simpleToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith('transfer amount exceeds balance');

      // Owner balance shouldn't have changed.
      expect(await simpleToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it('Should update balances after transfers', async () => {
      const initialOwnerBalance = await simpleToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await simpleToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await simpleToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await simpleToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await simpleToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await simpleToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
