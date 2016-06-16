all: help

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

.PHONY: clean  ## Clean out some superficial crust
clean:
	rm -rf dist

.PHONY: clean-all
clean-all: clean  ## Burn everything to the ground
	rm -rf tmp
	rm -rf node_modules
	rm -rf bower_components
	rm -rf .sass-cache
	rm -rf connect.lock
	rm -rf coverage/*
	rm -rf libpeerconnection.log
	rm -rf npm-debug.log
	rm -rf testem.log
	rm -f lcov.dat

.PHONY: install
install:  ## Install project dependencies
	npm install
	bower install

.PHONY: server
server: clean ## Run the ember server locally
	(command -v watchman >/dev/null 2>&1 && watchman watch-del `pwd` && watchman watch-project `pwd`) || true
	EMBER_GITHUB_APIKEY="a23e0b40bb0377aa6860" \
		EMBER_GITHUB_REDIRECT_URI="http://127.0.0.1:4200" \
		EMBER_ESA_TOKEN_ENDPOINT="http://127.0.0.1:8080/auth/token" \
		EMBER_ESA_REFRESH_ENDPOINT="http://127.0.0.1:8080/auth/refresh" \
		EMBER_NOTIFICATION_ENDPOINT="http://127.0.0.1:8081/notification" \
		ember server \
		--environment="development" \
		--live-reload=false

.PHONY: build-staging
build-staging: clean ## Build the staging version of the ember app
	EMBER_GITHUB_APIKEY="caf40f799d653c2ca635" \
		EMBER_GITHUB_REDIRECT_URI="https://my-staging.tidycat.io" \
		EMBER_ESA_TOKEN_ENDPOINT="https://api-staging.tidycat.io/auth/token" \
		EMBER_ESA_REFRESH_ENDPOINT="https://api-staging.tidycat.io/auth/refresh" \
		EMBER_NOTIFICATION_ENDPOINT="https://api-staging.tidycat.io/notification" \
		ember build \
		--environment production \
		--output-path dist/
	@echo "User-agent: *\nDisallow: /" > dist/robots.txt

.PHONY: build-production
build-production: clean ## Build the production version of the ember app
	EMBER_GITHUB_APIKEY="89a218832dc2e39f575b" \
		EMBER_GITHUB_REDIRECT_URI="https://my.tidycat.io" \
		EMBER_ESA_TOKEN_ENDPOINT="https://api.tidycat.io/auth/token" \
		EMBER_ESA_REFRESH_ENDPOINT="https://api.tidycat.io/auth/refresh" \
		EMBER_NOTIFICATION_ENDPOINT="https://api.tidycat.io/notification" \
		ember build \
		--environment production \
		--output-path dist/

.PHONY: eslint
eslint:  ## Run eslint on the relevant javascript files
	@`npm bin`/eslint config/
	@`npm bin`/eslint app/
	@`npm bin`/eslint tests/

.PHONY: unit-test
unit-test:  ## Run the ember unit tests
	@ember test

.PHONY: test
test: eslint unit-test  ## Run all the style + unit tests
	@echo "Tests look good!"
