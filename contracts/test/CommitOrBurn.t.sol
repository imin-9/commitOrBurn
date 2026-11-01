// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console2} from "forge-std/Test.sol";
import "src/CommitOrBurn.sol";

contract CommitOrBurnTest is Test {
    CommitOrBurn engine;

    string constant GITHUB_ID = "imin-9";
    uint256 constant DEPOSIT_AMOUNT = 0.1 ether;
    uint256 constant UNIT = 0.001 ether;

    address user = makeAddr("user");

    event Deposited(address indexed user, uint256 indexed roundId, string indexed githubId, uint256 shares);

    function setUp() public {
        engine = new CommitOrBurn();

        vm.deal(user, 1 ether);
    }

    /////////////////
    // Variables   //
    /////////////////
    function testInitialSet() public {
        uint256 currnetRound = engine.s_currentRound();
        uint256 unit = engine.UNIT();
        CommitOrBurn.Round memory roundInfo = engine.getRoundInfo(1);

        assertEq(currnetRound, 1);
        assertEq(unit, UNIT);
        assertEq(roundInfo.startTime, block.timestamp + 7 days);
        assertEq(roundInfo.endTime, block.timestamp + 14 days);
    }

    /////////////////
    // function /////
    /////////////////
    function testDepositSuccess() public {
        uint256 currnetRound = engine.s_currentRound();

        vm.expectEmit(true, true, true, true, address(engine));
        emit Deposited(user, currnetRound, GITHUB_ID, DEPOSIT_AMOUNT / UNIT);

        vm.prank(user);
        engine.deposit{value: DEPOSIT_AMOUNT}(GITHUB_ID);

        CommitOrBurn.User memory userInfo = engine.getUserInfo(user);
        CommitOrBurn.Round memory roundInfo = engine.getRoundInfo(currnetRound);

        assertEq(userInfo.githubId, GITHUB_ID);
        assertEq(userInfo.roundId, currnetRound);
        assertEq(userInfo.shares, DEPOSIT_AMOUNT / UNIT);

        assertEq(roundInfo.totalDeposited, DEPOSIT_AMOUNT);
    }

    function testDepositRevertsWhenEnterSameRound() public {
        vm.prank(user);
        engine.deposit{value: DEPOSIT_AMOUNT}(GITHUB_ID);

        vm.expectRevert(CommitOrBurn__CantEnterSameRound.selector);
        vm.prank(user);
        engine.deposit{value: DEPOSIT_AMOUNT}(GITHUB_ID);
    }

    function testDepositRevertsWhenValueLessThanUNIT() public {
        vm.expectRevert(CommitOrBurn__MustSendMoreThanOne.selector);

        vm.prank(user);
        engine.deposit{value: 0.0001 ether}(GITHUB_ID);
    }

    function testDepositRevertsWhenValueIsNotMultipleOfUNIT() public {
        vm.expectRevert(CommitOrBurn__MustSendMultipleOfUNIT.selector);

        vm.prank(user);
        engine.deposit{value: 0.0011 ether}(GITHUB_ID);
    }

    function testDepositRevertsWhenGithubIdIsEmpty() public {
        vm.expectRevert(CommitOrBurn__GithubIdIsNotExist.selector);

        vm.prank(user);
        engine.deposit{value: DEPOSIT_AMOUNT}("");
    }
}
