TESTS = test/*.js
REPORTER = spec
TIMEOUT = 20000

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(TESTS)

test-cov:
	@rm -rf ./lib-cov
	@$(MAKE) lib-cov
	@URLEXPAND_COV=1 $(MAKE) test
	@URLEXPAND_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@jscoverage lib $@

.PHONY: test-cov test test-g lib-cov
