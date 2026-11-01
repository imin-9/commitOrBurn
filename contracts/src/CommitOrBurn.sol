// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

error CommitOrBurn__CantEnterSameRound();
error CommitOrBurn__MustSendMoreThanOne();
error CommitOrBurn__MustSendMultipleOfUNIT();
error CommitOrBurn__GithubIdIsNotExist();

contract CommitOrBurn {
    struct Round {
        uint256 startTime;
        uint256 endTime;
        uint256 totalDeposited;
        bool resolved;
    }

    struct User {
        string githubId;
        uint256 roundId;
        uint256 shares;
    }

    mapping(uint256 => Round) private s_rounds;
    mapping(address => User) private s_users;

    uint256 public constant UNIT = 0.001 ether;
    uint256 public s_currentRound;

    event Deposited(address indexed user, uint256 indexed roundId, string indexed githubId, uint256 shares);

    constructor() {
        s_currentRound = 1;

        s_rounds[s_currentRound].startTime = block.timestamp + 7 days;
        s_rounds[s_currentRound].endTime = block.timestamp + 14 days;
    }

    function deposit(string memory _githubId) external payable {
        User storage user = s_users[msg.sender];

        if (user.roundId == s_currentRound) {
            revert CommitOrBurn__CantEnterSameRound();
        }

        if (msg.value < UNIT) {
            revert CommitOrBurn__MustSendMoreThanOne();
        }

        if (msg.value % UNIT != 0) {
            revert CommitOrBurn__MustSendMultipleOfUNIT();
        }

        if (bytes(_githubId).length == 0) {
            revert CommitOrBurn__GithubIdIsNotExist();
        }

        user.githubId = _githubId;
        user.roundId = s_currentRound;
        user.shares = msg.value / UNIT;

        s_rounds[s_currentRound].totalDeposited += msg.value;

        emit Deposited(msg.sender, s_currentRound, _githubId, user.shares);
    }

    function getUserInfo(address _user) external view returns (User memory) {
        return s_users[_user];
    }

    function getRoundInfo(uint256 _roundId) external view returns (Round memory) {
        return s_rounds[_roundId];
    }
}
