const hre = require("hardhat");

async function main() {
  const deployer = await hre.ethers.getSigner();
  console.log(`deploy with signer ${deployer.address}`);

  console.log(`try to deploy contract toDoFactory`);
  const toDo = await hre.ethers.getContractFactory("toDoFactory");
  const todo = await toDo.deploy();

  await todo.deployed();

  console.log(`This contract deployed to ${todo.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
