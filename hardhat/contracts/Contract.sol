// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

// Minimal interface for LethalNFT containing the functions we care about
interface ILethalNFT {
    /// @dev balanceOf returns the number of NFTs owned by the given address
    /// @param owner - address to fetch number of NFTs for
    /// @return Returns the number of NFTs owned
    function balanceOf(address owner) external view returns (uint256);

    /// @dev tokenOfOwnerByIndex returns a tokenID at given index for owner
    /// @param owner - address to fetch the NFT TokenID for
    /// @param index - index of NFT in owned tokens array to fetch
    /// @return Returns the TokenID of the NFT
    function tokenOfOwnerByIndex(address owner, uint256 index)
        external
        view
        returns (uint256);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;

    /// @dev Returns the owner of the `tokenId` token.
    function ownerOf(uint256 tokenId) external view returns (address owner);
}

contract Contract is AccessControl, IERC721Receiver{

    ILethalNFT lethalNFT;
    //Constructor
    constructor(address nftContract){
        lethalNFT = ILethalNFT(nftContract);
    }

    // Access Roles
    bytes32 public constant RESIDENT_ROLE = keccak256("RESIDENT_ROLE");
    bytes32 public constant EMPLOYEE_ROLE = keccak256("EMPLOYEE_ROLE");

    // Structs
    struct Resident{
        uint256 residentId;
        string name;
        uint256 age;
        string email;
        address walletAddress;
        string location;
        uint256[] lockedUpNFTs;
    }

    // Tags & Images is left
    struct Issue{
        uint256 issueId;
        string title;
        string message;
        string location;
        address walletAddress;
        uint256 upvotes;
        bool isOpen;
    }

    struct Employee{
        uint256 eId;
        string name;
        uint256 age;
        string email;
        address walletAddress;
        string location; 
    }

    // Images attribute left
    struct Update{
        uint256 updateId;
        uint256 issueId;
        string title;
        string message;
    }

    struct Feedback{
        uint256 feedbackId;
        uint256 issueId;
        string updateId;
        uint256 scale;
    }

    // Message Struct Left

    // Mappings
    mapping(address => Resident) residents;
    mapping(address => Employee) employees;
    mapping(uint256 => bool) public tokenLockedUp;
    // Mappings Left
    // All Issues Posted by a Resident
    // All Feedbacks Posted by a Resident
    // All Updates About an Issue from the Government
    // All Feedbacks about an Update from the Government about an Issue
    // Message to Wallet Id

    // Events
    event AddedResident(
        address walletAddress,
        string name,
        string email,
        string location
    );

    event AddedEmployee(
        address walletAddress, 
        string name,
        string email, 
        string location
    );

    // Variables
    uint256 private residentCounter;
    uint256 private employeeCounter;
    uint256 public totalVotingPower;

    // Functions

    // Add a Resident
    function addResident(
        string memory _name,
        uint256 _age,
        string memory _email,
        string memory _location
    ) external {
        require(
            residents[msg.sender].walletAddress == address(0),
            "Resident Already Exists"
        );
        residents[msg.sender] = Resident(residentCounter, _name, _age, _email, msg.sender, _location, new uint256[](0));
        _grantRole(RESIDENT_ROLE, msg.sender);
        residentCounter++;
        emit AddedResident(msg.sender, _name, _email, _location);
    }

    // Add an Employee
    function addEmployee(
        string memory _name,
        uint256 _age,
        string memory _email,
        string memory _location
    ) external {
        require(
            employees[msg.sender].walletAddress == address(0), 
            "Employee Already Exists"
        );
        employees[msg.sender] = Employee(employeeCounter, _name, _age, _email, msg.sender, _location);
        _grantRole(EMPLOYEE_ROLE, msg.sender);
        employeeCounter++;
        emit AddedEmployee(msg.sender, _name, _email, _location);
    }

    // Check Whether Wallet Holder is a Resident
    function isResident(
        address _walletAddress
    ) external view returns (bool) {
        return hasRole(RESIDENT_ROLE, _walletAddress);
    }

    // Check Whether Wallet Holder is an Employee
    function isEmployee(
        address _walletAddress
    ) external view returns (bool) {
        return hasRole(EMPLOYEE_ROLE, _walletAddress);
    }

    // Become a Member of the DAO
    function onERC721Received(
        address,
        address from,
        uint256 tokenId,
        bytes memory
    ) public override returns (bytes4) {
        require(lethalNFT.ownerOf(tokenId) == address(this), "MALICIOUS");
        require(tokenLockedUp[tokenId] == false, "ALREADY_USED");

        tokenLockedUp[tokenId] = true;
        totalVotingPower++;
        residents[from].lockedUpNFTs.push(tokenId);
        
        return this.onERC721Received.selector;
    } 

}