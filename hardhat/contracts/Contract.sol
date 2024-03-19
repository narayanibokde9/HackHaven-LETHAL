// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

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
    function tokenOfOwnerByIndex(
        address owner,
        uint256 index
    ) external view returns (uint256);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;

    /// @dev Returns the owner of the `tokenId` token.
    function ownerOf(uint256 tokenId) external view returns (address owner);

    function freeMint(address caller) external returns (uint256);
}

// PUSH Comm Contract Interface
interface IPUSHCommInterface {
    function sendNotification(address _channel, address _recipient, bytes calldata _identity) external;
}

contract Contract is AccessControl {
    ILethalNFT lethalNFT;
    //Constructor
    constructor(address nftContract) {
        lethalNFT = ILethalNFT(nftContract);
    }

    // Access Roles
    bytes32 public constant RESIDENT_ROLE = keccak256("RESIDENT_ROLE");
    bytes32 public constant EMPLOYEE_ROLE = keccak256("EMPLOYEE_ROLE");

    // Structs
    struct Resident {
        uint256 residentId;
        string name;
        uint256 age;
        string email;
        address walletAddress;
        string location;
        uint256[] lockedUpNFTs;
    }

    struct Grievance {
        uint256 grievanceId;
        uint256 chatId;
        string title;
        string[] tags;
        string message;
        string location;
        string[] images;
        address walletAddress;
        uint256 deadline;
        uint256 upvotes;
        bool convertedToIssue;
    }

    struct Issue {
        uint256 issueId;
        uint256 chatId;
        string title;
        string[] tags;
        string message;
        string location;
        string[] images;
        address walletAddress;
        uint256 deadline;
        uint256 upvotes;
        bool isOpen;
    }

    struct Employee {
        uint256 eId;
        string name;
        uint256 age;
        string email;
        address walletAddress;
        string location;
    }

    struct Update {
        uint256 updateId;
        uint256 issueId;
        address walletAddress;
        string title;
        string message;
        string[] images;
        uint256 dateOfUpdation;
    }

    struct Feedback {
        uint256 feedbackId;
        uint256 issueId;
        uint256 updateId;
        uint256 scale;
        string message;
    }

    // Mappings
    mapping(address => Resident) residents;
    mapping(address => Employee) employees;
    mapping(uint256 => Grievance) grievances;
    mapping(uint256 => Issue) issues;
    mapping(uint256 => bool) public tokenLockedUp;    
    mapping(uint256 => Resident[]) grievanceVoters;
    mapping(uint256 => Resident[]) issueVoters;
    mapping(uint256 => Update) updates;
    mapping(uint256 => Feedback) feedbacks;
    mapping(uint256 => Employee[]) grievanceEmployees;
    mapping(uint256 => Update[]) issueUpdates;
    mapping(uint256 => Feedback[]) updateFeedbacks;

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

    event AddedToDAO(
        address sender,
        uint256 tokenId
    );

    event RaisedGrievance(
        string title,
        string message
    );

    event UpvotedAnIssue(
        uint256 issueId,
        uint256 upvotes
    );

    event PostedUpdate(
        uint256 issueId,
        string message
    );

    event UpvotedAGrievance(
        uint256 grievanceId, 
        uint256 upvotes, 
        uint256 issueId        
    );

    event PostedFeedback(
        uint256 issueId, 
        uint256 updateId, 
        uint256 scale, 
        string message
    );

    // Variables
    uint256 private residentCounter;
    uint256 private employeeCounter;
    uint256 public grievancesCounter;
    uint256 public issueCounter;
    uint256 private updateCounter;
    uint256 private feedbackCounter;
    uint256 public totalVotingPower;

    // Modifiers
    modifier memberOnly() {
        require(residents[msg.sender].lockedUpNFTs.length > 0, "NOT_A_MEMBER");
        _;
    }

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
        residents[msg.sender] = Resident(
            residentCounter,
            _name,
            _age,
            _email,
            msg.sender,
            _location,
            new uint256[](0)
        );
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
        employees[msg.sender] = Employee(
            employeeCounter,
            _name,
            _age,
            _email,
            msg.sender,
            _location
        );
        _grantRole(EMPLOYEE_ROLE, msg.sender);
        employeeCounter++;
        emit AddedEmployee(msg.sender, _name, _email, _location);
    }

    // Check Whether Wallet Holder is a Resident
    function isResident(address _walletAddress) external view returns (bool) {
        return hasRole(RESIDENT_ROLE, _walletAddress);
    }

    // Check Whether Wallet Holder is an Employee
    function isEmployee(address _walletAddress) external view returns (bool) {
        return hasRole(EMPLOYEE_ROLE, _walletAddress);
    }

    // Become a Member of the DAO
    function addToDAO() external {
        uint256 tokenId = lethalNFT.freeMint(msg.sender);
        require(lethalNFT.ownerOf(tokenId) == address(msg.sender), "MALICIOUS");
        require(tokenLockedUp[tokenId] == false, "ALREADY_USED");

        tokenLockedUp[tokenId] = true;
        if(hasRole(RESIDENT_ROLE, msg.sender)){
            totalVotingPower++;
        }
        residents[msg.sender].lockedUpNFTs.push(tokenId);

        emit AddedToDAO(msg.sender, tokenId);
    }

    // Raise a Grievance
    function raiseGrievance(
        uint256 _chatId,
        string memory _title,
        string[] memory _tags,
        string memory _message,
        string memory _location,
        string[] memory _images
    ) external memberOnly{
        require(hasRole(RESIDENT_ROLE, msg.sender), "Only Residents can Post Grievances");
        grievances[grievancesCounter] = Grievance(
            grievancesCounter,
            _chatId, 
            _title,
            _tags,
            _message,
            _location, 
            _images, 
            msg.sender,
            block.timestamp + 5 minutes,
            0,
            false
        );  
        grievancesCounter++;
        emit RaisedGrievance(_title, _message);
    }

    // Fetch all Grievances yet to be Converted to Issues
    function getAllGrievances() external memberOnly view returns(Grievance[] memory){
        Grievance[] memory allGrievances = new Grievance[](grievancesCounter);
        uint256 counter;
        for(uint256 i = 0; i < grievancesCounter; i++){
            if(!grievances[i].convertedToIssue)
                allGrievances[counter++] = grievances[i];
        }
        return allGrievances;
    }

    // Vote on a Grievance
    function voteOnGrievance(
        uint256 _grievanceId
    ) external memberOnly{
        require(hasRole(RESIDENT_ROLE, msg.sender), "Only Residents can Vote on Grievances");
        Grievance storage grievance = grievances[_grievanceId];
        require(grievance.deadline > block.timestamp, "INACTIVE_GRIEVANCE");
        
        // Double Voting Prevention 
        Resident[] memory voters = grievanceVoters[_grievanceId];
        for(uint256 i = 0; i < voters.length; i++){
            require(voters[i].walletAddress == msg.sender, "DOUBLE_VOTING_NOT_ALLOWED");
        }

        Resident storage resident = residents[msg.sender];
        uint256 votingPower = resident.lockedUpNFTs.length;
        grievance.upvotes += votingPower;

        Resident memory voter = residents[msg.sender];
        grievanceVoters[grievancesCounter].push(voter);

        if(grievance.upvotes > uint256(30) * totalVotingPower / 100){
            issues[issueCounter] = Issue(
            issueCounter,
            grievance.chatId, 
            grievance.title,
            grievance.tags,
            grievance.message,
            grievance.location, 
            grievance.images, 
            grievance.walletAddress,
            block.timestamp + 5 minutes,
            0,
            true
            );
            issueCounter++;
            grievance.convertedToIssue = true;
            delete grievances[_grievanceId];
        }


        emit UpvotedAGrievance(_grievanceId, grievance.upvotes, issueCounter);
    }

    // Fetch all Unresolved Issues
    function getAllIssues() external memberOnly view returns(Issue[] memory){
        Issue[] memory allIssues = new Issue[](issueCounter);
        uint256 counter;
        for(uint256 i = 0; i < issueCounter; i++){
            if(issues[i].isOpen)
                allIssues[counter++] = issues[i];
        }
        return allIssues;
    }

    // Upvote an Issue
    function voteOnIssue(
        uint256 _issueId
    ) external memberOnly{
        require(hasRole(RESIDENT_ROLE, msg.sender), "Only Residents can Vote on Issues");
        Issue storage issue = issues[_issueId];
        require(issue.deadline > block.timestamp, "INACTIVE_PROPOSAL");
        
        // Double Voting Prevention 
        Resident[] memory voters = issueVoters[_issueId];
        for(uint256 i = 0; i < voters.length; i++){
            require(voters[i].walletAddress == msg.sender, "DOUBLE_VOTING_NOT_ALLOWED");
        }

        Resident storage resident = residents[msg.sender];
        uint256 votingPower = resident.lockedUpNFTs.length;
        issue.upvotes += votingPower;

        if(issue.upvotes > uint256(75) * totalVotingPower / 100){
            issue.isOpen = false;
        }

        Resident memory voter = residents[msg.sender];
        issueVoters[issueCounter].push(voter);
        
        emit UpvotedAnIssue(_issueId, issue.upvotes);
    }

    // Employees can post an Update on an Issue
    function postUpdate(
        uint256 _issueId,
        string memory _title,
        string memory _message,
        string[] memory _images
    ) external memberOnly{
        require(hasRole(EMPLOYEE_ROLE, msg.sender), "Only Employees can Post Updates");
        updates[updateCounter] = Update(
            updateCounter,
            _issueId,
            msg.sender,
            _title, 
            _message, 
            _images,
            block.timestamp
        );
        issueUpdates[_issueId].push(updates[updateCounter]);
        updateCounter++;
        IPUSHCommInterface(0x37c779a1564DCc0e3914aB130e0e787d93e21804).sendNotification(
            0xe53aa078E1af37E9c9f3AeFDC652bBDd98c8e51D, // from channel - recommended to set channel via dApp and put it's value -> then once contract is deployed, go back and add the contract address as delegate for your channel
            0xe53aa078E1af37E9c9f3AeFDC652bBDd98c8e51D, // to recipient, put YOUR_CHANNEL_ADDRESS in case you want Broadcast or Subset. For Targetted put the address to which you want to send

            bytes(
                string(
                    // We are passing identity here: https://push.org/docs/notifications/notification-standards/notification-standards-advance/#notification-identity
                    abi.encodePacked(
                        "0", // this represents minimal identity, learn more: https://push.org/docs/notifications/notification-standards/notification-standards-advance/#notification-identity
                        "+", // segregator
                        "1", // define notification type:  https://push.org/docs/notifications/build/types-of-notification (1, 3 or 4) = (Broadcast, targeted or subset)
                        "+", // segregator
                        _title, // this is notification title
                        "+", // segregator
                        _message // notification body
                    )
                )
            )
        );
        emit PostedUpdate(_issueId, _title);
    }

    // Residents can provide Feedbacks on an Issue
    function giveFeedback(
        uint256 _issueId,
        uint256 _updateId,
        uint256 _scale, 
        string memory _message
    ) external memberOnly{
        require(hasRole(RESIDENT_ROLE, msg.sender), "Only Residents can Give Feedback on Issues");
        feedbacks[feedbackCounter] = Feedback(feedbackCounter, _issueId, _updateId, _scale, _message);
        updateFeedbacks[feedbackCounter].push(feedbacks[feedbackCounter]);
        feedbackCounter++;
        emit PostedFeedback(_issueId, _updateId, _scale, _message);
    }

}
