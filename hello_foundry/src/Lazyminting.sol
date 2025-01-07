// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol"; // Import ECDSA for signature recovery

contract LazyMint is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable, EIP712 {
    using ECDSA for bytes32;

    string private constant SIGN_DOMAIN = "IIIT SRICITY";
    string private constant SIGN_VERSION = "1";
    address public minter;
    uint256 private _tokenIdCounter; // Manually manage the token ID counter

    mapping(string => bool) private _usedURIs; // Mapping to track used URIs

    constructor(address _minter)
        ERC721("LazyMint", "LNFT")
        Ownable(msg.sender)
        EIP712(SIGN_DOMAIN, SIGN_VERSION)
    {
        minter = _minter;
        _tokenIdCounter = 1; // Initialize counter to 1 (or any desired starting value)
    }

    struct LazyMintVoucher {
        string studentName;
        string uri;
        bytes signature;
    }

    function recover(LazyMintVoucher calldata voucher)
        public
        view
        returns (address)
    {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256(
                        "LazyMintVoucher(string studentName,string uri)"
                    ),
                    keccak256(bytes(voucher.studentName)),
                    keccak256(bytes(voucher.uri))
                )
            )
        );
        address signer = digest.recover(voucher.signature); // Use ECDSA.recover
        return signer;
    }

    function safeMint(LazyMintVoucher calldata voucher, address to) public {
        require(minter == recover(voucher), "wrong signature");
        require(!_usedURIs[voucher.uri], "URI already used"); // Check if the URI has already been used

        uint256 newTokenId = _tokenIdCounter; // Get the current token ID
        _tokenIdCounter++; // Manually increment the token ID

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, voucher.uri);

        _usedURIs[voucher.uri] = true; // Mark the URI as used
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        virtual
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override(ERC721, IERC721) pure {
        revert("its a soulbound token");
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721, IERC721) pure {
        revert("its a soulbound token");
    }

    function getAllOwnedNfts(address _addr) public view returns (string[] memory) {
        uint256 ownedNum = balanceOf(_addr);
        string[] memory tokenURIs = new string[](ownedNum);

        for (uint256 i = 0; i < ownedNum; i++) {
            tokenURIs[i] = tokenURI(tokenOfOwnerByIndex(_addr, i));
        }

        return tokenURIs;
    }
}
