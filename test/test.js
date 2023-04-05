const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

describe("Staking", function() {
    let stakingFactory, contract, token;
    let toWei, fromWei;
    beforeEach(async function() {
        const tokenContract = await ethers.getContractFactory("SolyankaToken");
        token = await tokenContract.deploy();
        stakingFactory = await ethers.getContractFactory("Staking");
        contract = await stakingFactory.deploy(token.address);
        toWei = (value) => ethers.utils.parseEther(value.toString())

        fromWei = (value) =>
            ethers.utils.formatEther(
                typeof value === "string" ? value : value.toString()
            )
    })
    it("stakeToken test", async function() {
        let user;
        [owner, user] = await ethers.getSigners()
        contractTokens = 100000;
        await token.transfer(contract.address, toWei(contractTokens));
        
        userTokens = 10000;
        await contract.transferToken(user.address, toWei(userTokens));
        await token.connect(user).approve(contract.address, toWei(userTokens));

        stakeTokensAmount = 1000;
        await contract.connect(user).stakeToken(toWei(stakeTokensAmount));
        
        const dayInSeconds = 86400;
        await ethers.provider.send("evm_increaseTime", [32 * dayInSeconds]);
        await contract.connect(user).claimReward();

        userBalance = fromWei(await token.balanceOf(user.address));
        const interestRate = 32;
        console.log(await contract.stakeInfos[user.address]);
        assert.equal(Math.round(userBalance + (stakeTokensAmount * interestRate / 100)), fromWei(await token.balanceOf(user.address)));
    })
});