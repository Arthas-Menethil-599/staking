const { ethers, run, network } = require("hardhat");


async function main() {
  const tokenContract = await ethers.getContractFactory("SolyankaToken");
  const token = await tokenContract.deploy();
  const stakingFactory = await ethers.getContractFactory("Staking");
  const contract = await stakingFactory.deploy(token.address);
  await contract.deployed();
  console.log(`Token address : ${token.address}`);
  console.log(`Contract address: ${contract.address}`);

  console.log(network.config);
  if(network.config.chainId === 97) {
    contract.deployTransaction.wait(15);
    verify(contract.address, [token.address]);
  }
}

async function verify(contractAddress, arguments) {
  try{
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: arguments,
    });
  }
  catch(e) {
    if(e.message.toLowerCase.include("already verified")) {
      console.log("The contract already verified.");
    }
    else {
      console.log(e);
    }
  }
}

main().then(()=> process.exit(0)).catch((error) =>  {
  console.error(error);
  process.exit(1);
});