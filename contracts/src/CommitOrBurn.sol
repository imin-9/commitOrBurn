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
        uint256 totalShares;
        bool resolved;
    }

    struct User {
        string githubId;
        uint256 roundId;
        uint256 shares;
    }

    mapping(uint256 => Round) private s_rounds;
    mapping(address => User) private s_users;
    mapping(uint256 => address[]) private s_roundUserList;

    uint256 public constant UNIT = 0.001 ether;
    uint256 public s_currentRound;

    event Deposited(address indexed user, uint256 indexed roundId, string indexed githubId, uint256 shares);

    constructor() {
        s_currentRound = 1;

        uint256 nextMidnight = ((block.timestamp / 1 days) + 1) * 1 days;

        s_rounds[s_currentRound].startTime = nextMidnight + 7 days;
        s_rounds[s_currentRound].endTime = nextMidnight + 14 days;
    }

    function deposit(string memory _githubId) external payable {
        User storage user = s_users[msg.sender];
        uint256 round = s_currentRound;

        if (block.timestamp >= s_rounds[s_currentRound].startTime) {
            round = s_currentRound + 1;
        }

        if (user.roundId == round) {
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
        user.roundId = round;
        user.shares = msg.value / UNIT;

        s_rounds[round].totalDeposited += msg.value;
        s_rounds[round].totalShares += user.shares;

        s_roundUserList[round].push(msg.sender);

        emit Deposited(msg.sender, round, _githubId, user.shares);
    }

    function getUsersByRound(uint256 _roundId) external view returns (string[] memory) {
        address[] memory userAddressList = s_roundUserList[_roundId];
        string[] memory githubIds = new string[](userAddressList.length);

        for (uint256 i = 0; i < userAddressList.length; i++) {
            githubIds[i] = s_users[userAddressList[i]].githubId;
        }

        return githubIds;
    }

    function getUserInfo(address _user) external view returns (User memory) {
        return s_users[_user];
    }

    function getRoundInfo(uint256 _roundId) external view returns (Round memory) {
        return s_rounds[_roundId];
    }
}
