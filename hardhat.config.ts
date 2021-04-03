import { HardhatUserConfig, task } from "hardhat/config";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import dotenv from "dotenv";
dotenv.config();
let mnemonic = process.env.MNEMONIC;
let privateKey = process.env.PRIVATE_KEY;
let accounts;
if (privateKey) {
  accounts = [privateKey];
} else {
  if (!mnemonic) {
    // FOR DEV ONLY, SET IT IN .env files if you want to keep it private
    // (IT IS IMPORTANT TO HAVE A NON RANDOM MNEMONIC SO THAT SCRIPTS CAN ACT ON THE SAME ACCOUNTS)
    mnemonic = "test test test test test test test test test test test junk";
    accounts = {
      mnemonic,
    };
  }
}
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
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
  defaultNetwork: "localhost",
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    hardhat: {},
    localhost: {
      url: "http://localhost:8545",
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.RINKEBY_INFURA}`,
      accounts,
    },
  },
  solidity: "0.7.6",
};

export default config;
