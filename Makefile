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

.PHONY: install
install:  ## Install project dependencies
	npm install
	bower install

.PHONY: server
server:  ## Run the ember server locally
	ember server

.PHONY: test
test:  ## Run all the unit tests
	ember test
