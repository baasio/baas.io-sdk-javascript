TESTS=test/*.js
REPORTER=dot

setup:
	git submodule update --init
	cd ./lib/node-jscoverage;./configure && make && make install
	npm install -g mocha
build:

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
	    --ui tdd \
	    --reporter $(REPORTER) \
	    --timeout 100 \
	    $(TESTS)

test-cov: clear-cov lib-cov
	BAASIO_COV=1 $(MAKE) test REPORTER=html-cov > ./test/coverage.html

lib-cov:
	jscoverage src test/coverage 

clear-cov:
	rm -rf ./test/coverage

test-docs:
	make test REPORTER=doc \
	    > docs/test.html
doc:

.PHONY: init build test
