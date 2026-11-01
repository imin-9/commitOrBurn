-include .env

build:
	forge build

test:
	forge test

deploy-sepolia:
	forge script script/DeployCommitOrBurn.s.sol:DeployCommitOrBurn \
		--rpc-url $(SEPOLIA_RPC_URL) \
		--account test_1 \
		--sender 0x62011AbA903BfA5c10Da2Ca113379dD0eB12B5B3 \
		--broadcast \
		--gas-limit 3000000 \
		--skip-simulation