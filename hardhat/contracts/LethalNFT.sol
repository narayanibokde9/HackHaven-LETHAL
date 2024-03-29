// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Super simple NFT contract that uses `ERC721Enumerable`
 * Allows for free NFT mints until `MAX_NFTS` count is reached
 */
contract LethalNFT is ERC721Enumerable, Ownable {
    uint256 public immutable MAX_NFTS;

    uint256 tokenIdCounter;

    constructor(uint256 maxNfts, address initialOwner) ERC721("Lethal", "LETH") Ownable(initialOwner){
        MAX_NFTS = maxNfts;
    }

    function freeMint(address caller) public returns (uint256){
        require(tokenIdCounter < MAX_NFTS, "MAX_SUPPLY_REACHED");
        tokenIdCounter++;
        _safeMint(caller, tokenIdCounter);
        return totalSupply();
    }
}