// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {CommitOrBurn} from "src/CommitOrBurn.sol";

contract DeployCommitOrBurn is Script {
    function run() public {
        vm.startBroadcast();
        CommitOrBurn engine = new CommitOrBurn();
        vm.stopBroadcast();

        console.log("CommitOrBurn deployed at:", address(engine));
    }
}
