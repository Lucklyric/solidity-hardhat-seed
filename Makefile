.PHONY: install clean startA startB

install:
	yarn install

clean:
	rm -rf `find . -name yarn.lock`
	rm -rf `find . -name node_modules`

startA:
	./node_modules/.bin/env-cmd -f envs/.env.exampleA npx hardhat node --network hardhat --no-deploy --show-accounts

startB:
	./node_modules/.bin/env-cmd -f envs/.env.exampleB npx hardhat node --network hardhat --no-deploy --show-accounts
