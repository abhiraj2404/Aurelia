// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.22;

// import {Test, console} from "forge-std/Test.sol";
// import {LazyMint} from "../src/Lazyminting.sol";
// import {EventManager} from "../src/Event.sol";

// contract LazyMintTest is Test {
//     LazyMint public lazyMintContract;
//     EventManager public eventManager;
//     uint256 public ownerprivatekey;
//     uint256 public minterprivatekey;
//     uint256 public participantprivatekey;
//     // Test addresses
//     address public owner;
//     address public minter;
//     address public participant;
    
//     // Setup function to initialize contracts and addresses before each test
//     function setUp() public {
//         // Create test addresses
//         ownerprivatekey=0x503f38a9c967ed597e47fe25643985f032b072db8075426a92110f82df48dfcb;
//         minterprivatekey=0x7e5bfb82febc4c2c8529167104271ceec190eafdca277314912eaabdb67c6e5f;
//         participantprivatekey=0xcc6d63f85de8fef05446ebdd3c537c72152d0fc437fd7aa62b3019b79bd1fdd4;
//         owner = vm.addr(ownerprivatekey);
//         console.log("Owner address: ", owner);
//         minter = vm.addr(minterprivatekey);
//         participant = vm.addr(participantprivatekey);
        
//         // Deploy contracts
//         vm.prank(owner);
//         lazyMintContract = new LazyMint(minter);
        
//         vm.prank(owner);
//         eventManager = new EventManager();
//     }
    
//     // Test creating a new event through EventManager
//     function testAddNewEvent() public {
//         vm.prank(participant);
//         eventManager.addNewEvent(minter);
        
//         // Verify the event was created
//         LazyMint[] memory events = eventManager.getEventContracts(participant);
//         assertEq(events.length, 1, "Event should be created");
//     }
    
//     // Test retrieving event contract by index
//     function testGetEventContractByIndex() public {
//         vm.prank(participant);
//         eventManager.addNewEvent(minter);
        
//         LazyMint retrievedContract = eventManager.getEventContractByIndex(participant, 0);
//         assertEq(address(retrievedContract), 
//                  address(eventManager.getEventContracts(participant)[0]), 
//                  "Retrieved contract should match");
//     }
    
//     // Test reverting when trying to get event contract with invalid index
//     function testGetEventContractByIndexRevert() public {
//         vm.prank(participant);
//         eventManager.addNewEvent(minter);
        
//         vm.expectRevert("Index out of bounds");
//         eventManager.getEventContractByIndex(participant, 1);
//     }
    
//     // Test lazy minting process
//     function testLazyMint() public {
//         // Prepare domain separator manually
//         bytes32 domainSeparator = keccak256(
//             abi.encode(
//                 keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
//                 keccak256(bytes("IIIT SRICITY")),
//                 keccak256(bytes("1")),
//                 block.chainid,
//                 address(lazyMintContract)
//             )
//         );
        
//         // Prepare voucher hash
//         bytes32 voucherTypeHash = keccak256("LazyMintVoucher(string studentName,string uri)");
//         bytes32 structHash = keccak256(
//             abi.encode(
//                 voucherTypeHash,
//                 keccak256(bytes("John Doe")),
//                 keccak256(bytes("https://example.com/token/1"))
//             )
//         );
        
//         // Create digest
//         bytes32 digest = keccak256(
//             abi.encodePacked(
//                 "\x19\x01",
//                 domainSeparator,
//                 structHash
//             )
//         );
        
//         // Sign the voucher
//         (uint8 v, bytes32 r, bytes32 s) = vm.sign(minterprivatekey, digest);
//         bytes memory signature = abi.encodePacked(r, s, v);
        
//         // Prepare voucher struct
//         LazyMint.LazyMintVoucher memory voucher = LazyMint.LazyMintVoucher({
//             studentName: "John Doe",
//             uri: "https://example.com/token/1",
//             signature: signature
//         });
        
//         // Perform lazy mint
//         vm.prank(participant);
//         lazyMintContract.safeMint(voucher, participant);
        
//         // Verify minting
//         assertEq(lazyMintContract.balanceOf(participant), 1, "Token should be minted");
//         assertEq(lazyMintContract.tokenURI(1), "https://example.com/token/1", "Token URI should match");
//     }
    
//     // Test preventing duplicate URI minting
//     function testPreventDuplicateURIMinting() public {
//         // Prepare domain separator manually
//         bytes32 domainSeparator = keccak256(
//             abi.encode(
//                 keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
//                 keccak256(bytes("IIIT SRICITY")),
//                 keccak256(bytes("1")),
//                 block.chainid,
//                 address(lazyMintContract)
//             )
//         );
        
//         // Prepare voucher hash
//         bytes32 voucherTypeHash = keccak256("LazyMintVoucher(string studentName,string uri)");
//         bytes32 structHash = keccak256(
//             abi.encode(
//                 voucherTypeHash,
//                 keccak256(bytes("John Doe")),
//                 keccak256(bytes("https://example.com/token/1"))
//             )
//         );
        
//         // Create digest
//         bytes32 digest = keccak256(
//             abi.encodePacked(
//                 "\x19\x01",
//                 domainSeparator,
//                 structHash
//             )
//         );
        
//         // Sign the voucher
//         (uint8 v, bytes32 r, bytes32 s) = vm.sign(minterprivatekey, digest);
//         bytes memory signature = abi.encodePacked(r, s, v);
        
//         // Prepare voucher struct
//         LazyMint.LazyMintVoucher memory voucher = LazyMint.LazyMintVoucher({
//             studentName: "John Doe",
//             uri: "https://example.com/token/1",
//             signature: signature
//         });
        
//         // First mint should succeed
//         vm.prank(participant);
//         lazyMintContract.safeMint(voucher, participant);
        
//         // Second mint should revert
//         vm.expectRevert("URI already used");
//         vm.prank(address(0x123));
//         lazyMintContract.safeMint(voucher, address(0x123));
//     }
    
//     // Test transfer prevention (soulbound token)
//     function testTransferPrevention() public {
//         // Prepare domain separator manually
//         bytes32 domainSeparator = keccak256(
//             abi.encode(
//                 keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
//                 keccak256(bytes("IIIT SRICITY")),
//                 keccak256(bytes("1")),
//                 block.chainid,
//                 address(lazyMintContract)
//             )
//         );
        
//         // Prepare voucher hash
//         bytes32 voucherTypeHash = keccak256("LazyMintVoucher(string studentName,string uri)");
//         bytes32 structHash = keccak256(
//             abi.encode(
//                 voucherTypeHash,
//                 keccak256(bytes("John Doe")),
//                 keccak256(bytes("https://example.com/token/1"))
//             )
//         );
        
//         // Create digest
//         bytes32 digest = keccak256(
//             abi.encodePacked(
//                 "\x19\x01",
//                 domainSeparator,
//                 structHash
//             )
//         );
        
//         // Sign the voucher
//         (uint8 v, bytes32 r, bytes32 s) = vm.sign(minterprivatekey, digest);
//         bytes memory signature = abi.encodePacked(r, s, v);
        
//         // Prepare voucher struct
//         LazyMint.LazyMintVoucher memory voucher = LazyMint.LazyMintVoucher({
//             studentName: "John Doe",
//             uri: "https://example.com/token/1",
//             signature: signature
//         });
        
//         // Mint the token
//         vm.prank(participant);
//         lazyMintContract.safeMint(voucher, participant);
        
//         // Try to transfer token
//         vm.expectRevert("its a soulbound token");
//         vm.prank(participant);
//         lazyMintContract.safeTransferFrom(participant, address(0x123), 1);
        
//         // Try another transfer method
//         vm.expectRevert("its a soulbound token");
//         vm.prank(participant);
//         lazyMintContract.transferFrom(participant, address(0x123), 1);
//     }
    
//     // Test retrieving all owned NFTs
//     function testGetAllOwnedNFTs() public {
//         // Prepare domain separator manually
//         bytes32 domainSeparator = keccak256(
//             abi.encode(
//                 keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
//                 keccak256(bytes("IIIT SRICITY")),
//                 keccak256(bytes("1")),
//                 block.chainid,
//                 address(lazyMintContract)
//             )
//         );
        
//         // Prepare vouchers
//         bytes32 voucherTypeHash = keccak256("LazyMintVoucher(string studentName,string uri)");
        
//         bytes32 structHash1 = keccak256(
//             abi.encode(
//                 voucherTypeHash,
//                 keccak256(bytes("John Doe")),
//                 keccak256(bytes("https://example.com/token/1"))
//             )
//         );
        
//         bytes32 structHash2 = keccak256(
//             abi.encode(
//                 voucherTypeHash,
//                 keccak256(bytes("Jane Doe")),
//                 keccak256(bytes("https://example.com/token/2"))
//             )
//         );
        
//         // Create digests
//         bytes32 digest1 = keccak256(
//             abi.encodePacked(
//                 "\x19\x01",
//                 domainSeparator,
//                 structHash1
//             )
//         );
        
//         bytes32 digest2 = keccak256(
//             abi.encodePacked(
//                 "\x19\x01",
//                 domainSeparator,
//                 structHash2
//             )
//         );
        
//         // Sign vouchers
//         (uint8 v1, bytes32 r1, bytes32 s1) = vm.sign(minterprivatekey, digest1);
//         (uint8 v2, bytes32 r2, bytes32 s2) = vm.sign(minterprivatekey, digest2);
        
//         bytes memory signature1 = abi.encodePacked(r1, s1, v1);
//         bytes memory signature2 = abi.encodePacked(r2, s2, v2);
        
//         // Prepare voucher structs
//         LazyMint.LazyMintVoucher memory voucher1 = LazyMint.LazyMintVoucher({
//             studentName: "John Doe",
//             uri: "https://example.com/token/1",
//             signature: signature1
//         });
        
//         LazyMint.LazyMintVoucher memory voucher2 = LazyMint.LazyMintVoucher({
//             studentName: "Jane Doe",
//             uri: "https://example.com/token/2",
//             signature: signature2
//         });
        
//         // Mint tokens
//         vm.prank(participant);
//         lazyMintContract.safeMint(voucher1, participant);
        
//         vm.prank(participant);
//         lazyMintContract.safeMint(voucher2, participant);
        
//         // Retrieve owned NFTs
//         string[] memory ownedNFTs = lazyMintContract.getAllOwnedNfts(participant);
        
//         // Verify
//         assertEq(ownedNFTs.length, 2, "Should have 2 owned NFTs");
//         assertEq(ownedNFTs[0], "https://example.com/token/1", "First URI should match");
//         assertEq(ownedNFTs[1], "https://example.com/token/2", "Second URI should match");
//     }
// }