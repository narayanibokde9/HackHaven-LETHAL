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

    it("Should Add a Resident to The DAO", async function () {
        const name = "John Doe", age = 18, email = "johndoe@gmail.com", location = "Thane";
        await expect(contract.connect(addr1).addResident(name, age, email, location)).to.emit(contract, "AddedResident").withArgs(addr1, name, email, location);
        await expect(contract.connect(addr1).addToDAO()).to.emit(contract, "AddedToDAO").withArgs(addr1, 1);
        await expect(contract.connect(addr1).addToDAO()).to.emit(contract, "AddedToDAO").withArgs(addr1, 2);
    })

    it("Should Add an Employee & Check", async function () {
        const name = "John Doe", age = 18, email = "johndoe@gmail.com", location = "Thane";
        await expect(contract.connect(addr1).addEmployee(name, age, email, location)).to.emit(contract, "AddedEmployee").withArgs(addr1, name, email, location);
        expect(await contract.isEmployee(addr1)).to.equal(true);
    })

    it("Should Raise an Issue & Other Resident Votes for it", async function(){
        const name1 = "John Doe", age1 = 18, email1 = "johndoe@gmail.com", location1 = "Thane";
        const name2 = "Jack Doe", age2 = 19, email2 = "jackdoe@gmail.com", location2 = "Mumbai";
        await expect(contract.connect(addr1).addResident(name1, age1, email1, location1)).to.emit(contract, "AddedResident").withArgs(addr1, name1, email1, location1);
        await expect(contract.connect(addr1).addToDAO()).to.emit(contract, "AddedToDAO").withArgs(addr1, 1);
        await expect(contract.connect(addr1).raiseIssue(1, "ABC", ["ab", "cd"], "Message", "Location", ["img1", "img2"])).to.emit(contract, "RaisedIssue").withArgs("ABC", "Message");
        
        await expect(contract.connect(addr2).addResident(name2, age2, email2, location2)).to.emit(contract, "AddedResident").withArgs(addr2, name2, email2, location2);
        await expect(contract.connect(addr2).addToDAO()).to.emit(contract, "AddedToDAO").withArgs(addr2, 2);
        await expect(contract.connect(addr2).vote(0)).to.emit(contract, "UpvotedAnIssue").withArgs(0, 1);
    })

    it("Should Add an Update on an Issue", async function(){
        const name1 = "John Doe", age1 = 18, email1 = "johndoe@gmail.com", location1 = "Thane";
        const name2 = "Jack Doe", age2 = 19, email2 = "jackdoe@gmail.com", location2 = "Mumbai";
        await expect(contract.connect(addr1).addResident(name1, age1, email1, location1)).to.emit(contract, "AddedResident").withArgs(addr1, name1, email1, location1);
        await expect(contract.connect(addr1).addToDAO()).to.emit(contract, "AddedToDAO").withArgs(addr1, 1);
        await expect(contract.connect(addr1).raiseIssue(1, "ABC", ["ab", "cd"], "Message", "Location", ["img1", "img2"])).to.emit(contract, "RaisedIssue").withArgs("ABC", "Message");

        await expect(contract.connect(addr2).addEmployee(name2, age2, email2, location2)).to.emit(contract, "AddedEmployee").withArgs(addr2, name2, email2, location2);
        await expect(contract.connect(addr2).addToDAO()).to.emit(contract, "AddedToDAO").withArgs(addr2, 2);
        await expect(contract.connect(addr2).postUpdate(0, "Update", "Work Done", ["ab", "cd"])).to.emit(contract, "PostedUpdate").withArgs(0, "Update");
    })

    it("Should Post a Feedback on an Update", async function(){
        const name1 = "John Doe", age1 = 18, email1 = "johndoe@gmail.com", location1 = "Thane";
        const name2 = "Jack Doe", age2 = 19, email2 = "jackdoe@gmail.com", location2 = "Mumbai";
        await expect(contract.connect(addr1).addResident(name1, age1, email1, location1)).to.emit(contract, "AddedResident").withArgs(addr1, name1, email1, location1);
        await expect(contract.connect(addr1).addToDAO()).to.emit(contract, "AddedToDAO").withArgs(addr1, 1);
        await expect(contract.connect(addr1).raiseIssue(1, "ABC", ["ab", "cd"], "Message", "Location", ["img1", "img2"])).to.emit(contract, "RaisedIssue").withArgs("ABC", "Message");

        await expect(contract.connect(addr2).addEmployee(name2, age2, email2, location2)).to.emit(contract, "AddedEmployee").withArgs(addr2, name2, email2, location2);
        await expect(contract.connect(addr2).addToDAO()).to.emit(contract, "AddedToDAO").withArgs(addr2, 2);
        await expect(contract.connect(addr2).postUpdate(0, "Update", "Work Done", ["ab", "cd"])).to.emit(contract, "PostedUpdate").withArgs(0, "Update");

        await expect(contract.connect(addr1).giveFeedback(0, 0, 5, "Message")).to.emit(contract, "PostedFeedback").withArgs(0, 0, 5, "Message");
    })

})