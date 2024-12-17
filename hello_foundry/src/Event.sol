// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./Lazyminting.sol"; // Import your LazyMint contract

contract EventManager {
    // Mapping of organizer address to an array of LazyMint contract instances
    mapping(address => LazyMint[]) public organizerContracts;

    event NewEventCreated(address organizer, address contractAddress);

    // Function to create a new event (new LazyMint instance) for an organizer
    function addNewEvent(address minter) public {
        // Create a new LazyMint contract instance for the event organizer
        LazyMint newEvent = new LazyMint(minter);
        
        // Add the new event (LazyMint contract) to the organizer's list
        organizerContracts[msg.sender].push(newEvent); // Push to array

        // Emit event with organizer's address and new LazyMint contract address
        emit NewEventCreated(msg.sender, address(newEvent));
    }

    // Function to get the list of LazyMint contracts created by an organizer
    function getEventContracts(address organizer) public view returns (LazyMint[] memory) {
        return organizerContracts[organizer]; // Return the list of contracts
    }

    // Function to get a specific LazyMint contract created by an organizer
    function getEventContractByIndex(address organizer, uint256 index) public view returns (LazyMint) {
        require(index < organizerContracts[organizer].length, "Index out of bounds");
        return organizerContracts[organizer][index]; // Return the contract at the given index
    }
}
