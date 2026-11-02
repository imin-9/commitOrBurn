-include .env

build:
	forge build

test:
	forge test

deploy-sepolia:
	forge script script/DeployCommitOrBurn.s.sol:DeployCommitOrBurn \
		--rpc-url $(SEPOLIA_RPC_URL) \
		--account test_1 \
		--broadcast \
		--gas-limit 3000000 \
		--skip-simulation \
		--verify \
  		--etherscan-api-key $(ETHERSCAN_API_KEY)