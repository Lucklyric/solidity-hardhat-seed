# solidity-hardhat-truffle-seed
solidity smart contract project seed

## Install dependencies
```bash
npm i
```
## Compile contracts
```bash
npx hardhat compile
```

## Hardhat start local test node
```bash
npx hardhat node --network hardhat --no-deploy
# or use arbitrary env file
./node_modules/.bin/env-cmd -f envs/.env.exampleA npx hardhat node --network hardhat --no-deploy --show-accounts
```

## Hardhat run tests on local node
```bash
npx hardhat test --network localhost
# or use arbitrary env file e.g.
./node_modules/.bin/env-cmd -f envs/.env.exampleA npx hardhat test --network localhost
```

## Hardhat run scripts on local node
```bash
npx hardhat run scripts/sample-script.ts --network localhost
# or use arbitrary env file e.g.
./node_modules/.bin/env-cmd -f envs/.env.exampleA npx hardhat run scripts/sample-script.ts --network localhost
```

## Hardhat run deploy
```bash
npx hardhat deploy --network localhost
# or use arbitrary env file e.g.
./node_modules/.bin/env-cmd -f envs/.env.exampleA npx hardhat deploy --network localhost --reset
```
