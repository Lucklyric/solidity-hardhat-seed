import dotenv from 'dotenv';
import {HardhatUserConfig, task} from 'hardhat/config';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'hardhat-docgen';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-contract-sizer';
import 'solidity-coverage';

dotenv.config();
let mnemonic = process.env.MNEMONIC;
const privateKey = process.env.PRIVATE_KEY;
let accounts;
if (privateKey) {
  accounts = [privateKey];
} else {
  if (!mnemonic) {
    // FOR DEV ONLY, SET IT IN .env files if you want to keep it private
    // (IT IS IMPORTANT TO HAVE A NON RANDOM MNEMONIC SO THAT SCRIPTS CAN ACT ON THE SAME ACCOUNTS)
    mnemonic = 'test test test test test test test test test test test junk';
  }
  accounts = {
    mnemonic,
  };
}
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  paths: {
    sources: 'src',
  },
  defaultNetwork: 'localhost',
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
    },
    localhost: {
      url: 'http://localhost:8545',
      accounts,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.RINKEBY_INFURA}`,
      accounts,
    },
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  solidity: {
    version: '0.8.2',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
};

export default config;
