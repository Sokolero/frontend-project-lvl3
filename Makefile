install:
	npm ci

start:
	npx webpack serve --open

build:
	rm -rf build
	NODE_ENV=production npx webpack

lint:
	npx eslint src/

test:
	npm test

PHONY:
	test
