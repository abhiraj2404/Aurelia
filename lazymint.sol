// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol"; // Import ECDSA for signature recovery

contract LazyMint is ERC721, ERC721URIStorage, Ownable, EIP712 {
    using ECDSA for bytes32; // Use ECDSA functions like recover

    string private constant SIGN_DOMAIN = "IIIT SRICITY";
    string private constant SIGN_VERSION = "1";
    address public minter;

    constructor(address _minter)
        ERC721("LazyMint", "LNFT")
        Ownable(msg.sender)
        EIP712(SIGN_DOMAIN, SIGN_VERSION)
    {
        minter = _minter;
    }

    struct LazyMintVoucher {
        uint256 tokenId;
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
                        "LazyMintVoucher(uint256 tokenId,string studentName,string uri)"
                    ),
                    voucher.tokenId,
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
        _safeMint(to, voucher.tokenId);
        _setTokenURI(voucher.tokenId, voucher.uri);
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
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override(ERC721, IERC721) {
        revert("its a soulbound token");
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721, IERC721) {
        revert("its a soulbound token");
    }
}
