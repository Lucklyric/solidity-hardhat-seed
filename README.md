# solidity-hardhat-truffle-seed
solidity smart contract project seed

## Install dependencies
```bash
yarn
```

## Compile contracts
```bash
yarn run hardhat compile
```

## Build doc 
```bash
yarn run hardhat docgen 
```

## Hardhat start local test node
```bash
yarn run hardhat node --network hardhat --no-deploy
# or use arbitrary env file
yarn run env-cmd -f envs/.env.exampleA npx hardhat node --network hardhat --no-deploy --show-accounts
```

## Hardhat run tests on local node
```bash
yarn run hardhat test --network localhost
# or use arbitrary env file e.g.
yarn run env-cmd -f envs/.env.exampleA npx hardhat test --network localhost
```

## Hardhat run scripts on local node
```bash
yarn run hardhat run scripts/sample-script.ts --network localhost
# or use arbitrary env file e.g.
yarn run env-cmd -f envs/.env.exampleA npx hardhat run scripts/sample-script.ts --network localhost
```

## Hardhat run deploy
```bash
yarn run hardhat deploy --network localhost
# or use arbitrary env file e.g.
yarn run env-cmd -f envs/.env.exampleA npx hardhat deploy --network localhost --reset
```

