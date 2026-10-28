// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract CommitOrBurn {
    struct UserInfo {
        string githubId;
        uint256 balance;
        uint256 startTime;
        uint256 endTime;
    }

    mapping(address => UserInfo) public s_userInfo;
    mapping(string => bool) public s_isGithubIdRegistered;

    event Deposited(address indexed user, uint256 amount);

    function Deposit() external payable {
        emit Deposited(msg.sender, msg.value);
    }
}
