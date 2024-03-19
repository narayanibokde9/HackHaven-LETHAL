const hre = require("hardhat");

async function main() {
	const lock = await hre.ethers.getContractFactory("LethalNFT");
	const cont = await lock.deploy(1000);
	const contract = await cont.waitForDeployment();

	console.log(contract.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
