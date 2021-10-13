import dotenv from 'dotenv';
import {HardhatUserConfig, task} from 'hardhat/config';
import {BigNumber} from 'ethers';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'hardhat-docgen';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-contract-sizer';
import 'solidity-coverage';
import '@nomiclabs/hardhat-waffle';
import fs from 'fs';

if (fs.existsSync('./typechain')) {
  import('./tasks');
}

dotenv.config();
let mnemonic = process.env.MNEMONIC;
const privateKey = process.env.PRIVATE_KEY;
const gasPrice = process.env.GAS_PRICE || 1;
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
        accountsBalance: '100000000000000000000000000',
      },
      blockGasLimit: 60000000,
      initialBaseFeePerGas: 0,
    },
    localhost: {
      url: 'http://localhost:8545',
      accounts,
      timeout: 60000,
      blockGasLimit: 60000000,
      gasPrice: BigNumber.from(gasPrice)
        .mul(10 ** 9)
        .toNumber(),
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.MAINNET_INFURA}`,
      accounts,
      timeout: 60000,
      gasPrice: BigNumber.from(gasPrice)
        .mul(10 ** 9)
        .toNumber(),
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.RINKEBY_INFURA}`,
      accounts,
      timeout: 60000,
      gasPrice: BigNumber.from(gasPrice)
        .mul(10 ** 9)
        .toNumber(),
    },
    bsc: {
      url: `https://bsc-dataseed1.binance.org/`,
      accounts,
      timeout: 60000,
      gasPrice: BigNumber.from(gasPrice)
        .mul(10 ** 9)
        .toNumber(),
    },
    bscTest: {
      url: `https://data-seed-prebsc-2-s1.binance.org:8545`,
      accounts,
      timeout: 120000,
      gasPrice: BigNumber.from(gasPrice)
        .mul(10 ** 9)
        .toNumber(),
    },
    whitematrix: {
      accounts,
      url: 'http://ec2-54-178-51-255.ap-northeast-1.compute.amazonaws.com:8545',
      timeout: 60000,
      gasPrice: BigNumber.from(gasPrice)
        .mul(10 ** 9)
        .toNumber(),
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
