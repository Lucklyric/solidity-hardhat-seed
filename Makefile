install:
	yarn install

clean:
	rm -rf `find . -name yarn.lock`
	rm -rf `find . -name node_modules`

build:
	yarn build

coverage:
	yarn test:cov

.PHONY: install clean
