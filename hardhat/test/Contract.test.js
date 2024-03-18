const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Contract Test", function () {
    let Contract, contract, owner, addr1, addr2;

    beforeEach(async () => {
        NFTContract = await ethers.getContractFactory("LethalNFT");
        nftContract = await NFTContract.deploy(100, ethers.getAddress("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"));

        Contract = await ethers.getContractFactory("Contract");
        [owner, addr1, addr2] = await ethers.getSigners();
        contract = await Contract.deploy(nftContract);
    })

    it("Should Add a Resident & Check", async function () {
        const name = "John Doe", age = 18, email = "johndoe@gmail.com", location = "Thane";
        await expect(contract.connect(addr1).addResident(name, age, email, location)).to.emit(contract, "AddedResident").withArgs(addr1, name, email, location);
        expect(await contract.isResident(addr1)).to.equal(true);
    })

    it("Should Add an Employee & Check", async function () {
        const name = "John Doe", age = 18, email = "johndoe@gmail.com", location = "Thane";
        await expect(contract.connect(addr1).addEmployee(name, age, email, location)).to.emit(contract, "AddedEmployee").withArgs(addr1, name, email, location);
        expect(await contract.isEmployee(addr1)).to.equal(true);
    })

    it("Should Lock Up the Received NFT", async function () {
        await nftContract.safeTransferFrom(owner.address, contract.address, 1, '0x', { from: owner.address });
    })
})