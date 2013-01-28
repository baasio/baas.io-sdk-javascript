test:
	./node_modules/.bin/mocha \
			     --reporter list

test-docs:
	make test REPORTER=doc \
		| cat docs/head.html - docs/tail.html \
		> docs/test.html

.PHONY: test
