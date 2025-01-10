"use client";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { ChevronDownIcon, LayoutGrid, List, Search } from "lucide-react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { Spinner } from "@nextui-org/spinner";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { getContract } from "thirdweb";

import { client, chain } from "@/config/client"

export default function CollectionsPage() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const name = searchParams.get("name");

  const [nfts, setNfts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("all");
  const account = useActiveAccount();
  const address = useActiveAccount()?.address;
const [loading, setIsloading] = useState(false);

  useEffect(() => {
    async function fetchNFTs() {
        setIsloading(true);
      try {
        const response = await axios.get("/api/getNFTs", {
          params: {
            id: id,
          },
        });

        const metadataFiles = response.data;

        console.log("metadataFiles", metadataFiles);
        setNfts(metadataFiles);
        setIsloading(false);
      } catch (error) {
        console.log("Error fetching NFTs:", error);
        setIsloading(false);
        alert(`Error fetching NFTs ${error}`);
      }
    }
    console.log("Fetching NFTs...");
    fetchNFTs();
    console.log("fetched");

  }, []);


  const filteredNFTs = nfts.filter(
    (nft) =>
      nft.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === "all" ||
        (filter === "below1" && parseFloat(nft.price) < 1) ||
        (filter === "above1" && parseFloat(nft.price) >= 1))
  );

  const handleBuyNow = async (nft: any, index: any) => {
    try {
      const data = {
        tokenId: nft.tokenId,
        studentName: nft.name,
        uri: nft.metaUrl,
        groupId: id,
      };

      const uploadRequest = await fetch("/api/getVoucher", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const response = await axios.get("/api/contractAddress", {
        params: {
          groupId: id,
        },
      });

      let contractAddress = response.data.data;

      const contract = getContract({
        address: contractAddress,
        client: client,
        chain: chain,
        abi: [
          {
              "type": "constructor",
              "inputs": [
                  {
                      "name": "_minter",
                      "type": "address",
                      "internalType": "address"
                  }
              ],
              "stateMutability": "nonpayable"
          },
          {
              "type": "function",
              "name": "approve",
              "inputs": [
                  {
                      "name": "to",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "tokenId",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ],
              "outputs": [],
              "stateMutability": "nonpayable"
          },
          {
              "type": "function",
              "name": "balanceOf",
              "inputs": [
                  {
                      "name": "owner",
                      "type": "address",
                      "internalType": "address"
                  }
              ],
              "outputs": [
                  {
                      "name": "",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ],
              "stateMutability": "view"
          },
          {
              "type": "function",
              "name": "eip712Domain",
              "inputs": [],
              "outputs": [
                  {
                      "name": "fields",
                      "type": "bytes1",
                      "internalType": "bytes1"
                  },
                  {
                      "name": "name",
                      "type": "string",
                      "internalType": "string"
                  },
                  {
                      "name": "version",
                      "type": "string",
                      "internalType": "string"
                  },
                  {
                      "name": "chainId",
                      "type": "uint256",
                      "internalType": "uint256"
                  },
                  {
                      "name": "verifyingContract",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "salt",
                      "type": "bytes32",
                      "internalType": "bytes32"
                  },
                  {
                      "name": "extensions",
                      "type": "uint256[]",
                      "internalType": "uint256[]"
                  }
              ],
              "stateMutability": "view"
          },
          {
              "type": "function",
              "name": "getAllOwnedNfts",
              "inputs": [
                  {
                      "name": "_addr",
                      "type": "address",
                      "internalType": "address"
                  }
              ],
              "outputs": [
                  {
                      "name": "",
                      "type": "string[]",
                      "internalType": "string[]"
                  }
              ],
              "stateMutability": "view"
          },
          {
              "type": "function",
              "name": "getApproved",
              "inputs": [
                  {
                      "name": "tokenId",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ],
              "outputs": [
                  {
                      "name": "",
                      "type": "address",
                      "internalType": "address"
                  }
              ],
              "stateMutability": "view"
          },
          {
              "type": "function",
              "name": "isApprovedForAll",
              "inputs": [
                  {
                      "name": "owner",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "operator",
                      "type": "address",
                      "internalType": "address"
                  }
              ],
              "outputs": [
                  {
                      "name": "",
                      "type": "bool",
                      "internalType": "bool"
                  }
              ],
              "stateMutability": "view"
          },
          {
              "type": "function",
              "name": "minter",
              "inputs": [],
              "outputs": [
                  {
                      "name": "",
                      "type": "address",
                      "internalType": "address"
                  }
              ],
              "stateMutability": "view"
          },
          {
              "type": "function",
              "name": "name",
              "inputs": [],
              "outputs": [
                  {
                      "name": "",
                      "type": "string",
                      "internalType": "string"
                  }
              ],
              "stateMutability": "view"
          },
          {
              "type": "function",
              "name": "owner",
              "inputs": [],
              "outputs": [
                  {
                      "name": "",
                      "type": "address",
                      "internalType": "address"
                  }
              ],
              "stateMutability": "view"
          },
          {
              "type": "function",
              "name": "ownerOf",
              "inputs": [
                  {
                      "name": "tokenId",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ],
              "outputs": [
                  {
                      "name": "",
                      "type": "address",
                      "internalType": "address"
                  }
              ],
              "stateMutability": "view"
          },
          {
              "type": "function",
              "name": "recover",
              "inputs": [
                  {
                      "name": "voucher",
                      "type": "tuple",
                      "internalType": "struct LazyMint.LazyMintVoucher",
                      "components": [
                          {
                              "name": "tokenId",
                              "type": "uint256",
                              "internalType": "uint256"
                          },
                          {
                              "name": "studentName",
                              "type": "string",
                              "internalType": "string"
                          },
                          {
                              "name": "uri",
                              "type": "string",
                              "internalType": "string"
                          },
                          {
                              "name": "signature",
                              "type": "bytes",
                              "internalType": "bytes"
                          }
                      ]
                  }
              ],
              "outputs": [
                  {
                      "name": "",
                      "type": "address",
                      "internalType": "address"
                  }
              ],
              "stateMutability": "view"
          },
          {
              "type": "function",
              "name": "renounceOwnership",
              "inputs": [],
              "outputs": [],
              "stateMutability": "nonpayable"
          },
          {
              "type": "function",
              "name": "safeMint",
              "inputs": [
                  {
                      "name": "voucher",
                      "type": "tuple",
                      "internalType": "struct LazyMint.LazyMintVoucher",
                      "components": [
                          {
                              "name": "tokenId",
                              "type": "uint256",
                              "internalType": "uint256"
                          },
                          {
                              "name": "studentName",
                              "type": "string",
                              "internalType": "string"
                          },
                          {
                              "name": "uri",
                              "type": "string",
                              "internalType": "string"
                          },
                          {
                              "name": "signature",
                              "type": "bytes",
                              "internalType": "bytes"
                          }
                      ]
                  },
                  {
                      "name": "to",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "tokenId",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ],
              "outputs": [],
              "stateMutability": "nonpayable"
          },
          {
              "type": "function",
              "name": "safeTransferFrom",
              "inputs": [
                  {
                      "name": "from",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "to",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "tokenId",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ],
              "outputs": [],
              "stateMutability": "nonpayable"
          },
          {
              "type": "function",
              "name": "safeTransferFrom",
              "inputs": [
                  {
                      "name": "from",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "to",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "tokenId",
                      "type": "uint256",
                      "internalType": "uint256"
                  },
                  {
                      "name": "data",
                      "type": "bytes",
                      "internalType": "bytes"
                  }
              ],
              "outputs": [],
              "stateMutability": "pure"
          },
          {
              "type": "function",
              "name": "setApprovalForAll",
              "inputs": [
                  {
                      "name": "operator",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "approved",
                      "type": "bool",
                      "internalType": "bool"
                  }
              ],
              "outputs": [],
              "stateMutability": "nonpayable"
          },
          {
              "type": "function",
              "name": "supportsInterface",
              "inputs": [
                  {
                      "name": "interfaceId",
                      "type": "bytes4",
                      "internalType": "bytes4"
                  }
              ],
              "outputs": [
                  {
                      "name": "",
                      "type": "bool",
                      "internalType": "bool"
                  }
              ],
              "stateMutability": "view"
          },
          {
              "type": "function",
              "name": "symbol",
              "inputs": [],
              "outputs": [
                  {
                      "name": "",
                      "type": "string",
                      "internalType": "string"
                  }
              ],
              "stateMutability": "view"
          },
          {
              "type": "function",
              "name": "tokenByIndex",
              "inputs": [
                  {
                      "name": "index",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ],
              "outputs": [
                  {
                      "name": "",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ],
              "stateMutability": "view"
          },
          {
              "type": "function",
              "name": "tokenOfOwnerByIndex",
              "inputs": [
                  {
                      "name": "owner",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "index",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ],
              "outputs": [
                  {
                      "name": "",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ],
              "stateMutability": "view"
          },
          {
              "type": "function",
              "name": "tokenURI",
              "inputs": [
                  {
                      "name": "tokenId",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ],
              "outputs": [
                  {
                      "name": "",
                      "type": "string",
                      "internalType": "string"
                  }
              ],
              "stateMutability": "view"
          },
          {
              "type": "function",
              "name": "totalSupply",
              "inputs": [],
              "outputs": [
                  {
                      "name": "",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ],
              "stateMutability": "view"
          },
          {
              "type": "function",
              "name": "transferFrom",
              "inputs": [
                  {
                      "name": "from",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "to",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "tokenId",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ],
              "outputs": [],
              "stateMutability": "pure"
          },
          {
              "type": "function",
              "name": "transferOwnership",
              "inputs": [
                  {
                      "name": "newOwner",
                      "type": "address",
                      "internalType": "address"
                  }
              ],
              "outputs": [],
              "stateMutability": "nonpayable"
          },
          {
              "type": "event",
              "name": "Approval",
              "inputs": [
                  {
                      "name": "owner",
                      "type": "address",
                      "indexed": true,
                      "internalType": "address"
                  },
                  {
                      "name": "approved",
                      "type": "address",
                      "indexed": true,
                      "internalType": "address"
                  },
                  {
                      "name": "tokenId",
                      "type": "uint256",
                      "indexed": true,
                      "internalType": "uint256"
                  }
              ],
              "anonymous": false
          },
          {
              "type": "event",
              "name": "ApprovalForAll",
              "inputs": [
                  {
                      "name": "owner",
                      "type": "address",
                      "indexed": true,
                      "internalType": "address"
                  },
                  {
                      "name": "operator",
                      "type": "address",
                      "indexed": true,
                      "internalType": "address"
                  },
                  {
                      "name": "approved",
                      "type": "bool",
                      "indexed": false,
                      "internalType": "bool"
                  }
              ],
              "anonymous": false
          },
          {
              "type": "event",
              "name": "BatchMetadataUpdate",
              "inputs": [
                  {
                      "name": "_fromTokenId",
                      "type": "uint256",
                      "indexed": false,
                      "internalType": "uint256"
                  },
                  {
                      "name": "_toTokenId",
                      "type": "uint256",
                      "indexed": false,
                      "internalType": "uint256"
                  }
              ],
              "anonymous": false
          },
          {
              "type": "event",
              "name": "EIP712DomainChanged",
              "inputs": [],
              "anonymous": false
          },
          {
              "type": "event",
              "name": "MetadataUpdate",
              "inputs": [
                  {
                      "name": "_tokenId",
                      "type": "uint256",
                      "indexed": false,
                      "internalType": "uint256"
                  }
              ],
              "anonymous": false
          },
          {
              "type": "event",
              "name": "OwnershipTransferred",
              "inputs": [
                  {
                      "name": "previousOwner",
                      "type": "address",
                      "indexed": true,
                      "internalType": "address"
                  },
                  {
                      "name": "newOwner",
                      "type": "address",
                      "indexed": true,
                      "internalType": "address"
                  }
              ],
              "anonymous": false
          },
          {
              "type": "event",
              "name": "Transfer",
              "inputs": [
                  {
                      "name": "from",
                      "type": "address",
                      "indexed": true,
                      "internalType": "address"
                  },
                  {
                      "name": "to",
                      "type": "address",
                      "indexed": true,
                      "internalType": "address"
                  },
                  {
                      "name": "tokenId",
                      "type": "uint256",
                      "indexed": true,
                      "internalType": "uint256"
                  }
              ],
              "anonymous": false
          },
          {
              "type": "error",
              "name": "ECDSAInvalidSignature",
              "inputs": []
          },
          {
              "type": "error",
              "name": "ECDSAInvalidSignatureLength",
              "inputs": [
                  {
                      "name": "length",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ]
          },
          {
              "type": "error",
              "name": "ECDSAInvalidSignatureS",
              "inputs": [
                  {
                      "name": "s",
                      "type": "bytes32",
                      "internalType": "bytes32"
                  }
              ]
          },
          {
              "type": "error",
              "name": "ERC721EnumerableForbiddenBatchMint",
              "inputs": []
          },
          {
              "type": "error",
              "name": "ERC721IncorrectOwner",
              "inputs": [
                  {
                      "name": "sender",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "tokenId",
                      "type": "uint256",
                      "internalType": "uint256"
                  },
                  {
                      "name": "owner",
                      "type": "address",
                      "internalType": "address"
                  }
              ]
          },
          {
              "type": "error",
              "name": "ERC721InsufficientApproval",
              "inputs": [
                  {
                      "name": "operator",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "tokenId",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ]
          },
          {
              "type": "error",
              "name": "ERC721InvalidApprover",
              "inputs": [
                  {
                      "name": "approver",
                      "type": "address",
                      "internalType": "address"
                  }
              ]
          },
          {
              "type": "error",
              "name": "ERC721InvalidOperator",
              "inputs": [
                  {
                      "name": "operator",
                      "type": "address",
                      "internalType": "address"
                  }
              ]
          },
          {
              "type": "error",
              "name": "ERC721InvalidOwner",
              "inputs": [
                  {
                      "name": "owner",
                      "type": "address",
                      "internalType": "address"
                  }
              ]
          },
          {
              "type": "error",
              "name": "ERC721InvalidReceiver",
              "inputs": [
                  {
                      "name": "receiver",
                      "type": "address",
                      "internalType": "address"
                  }
              ]
          },
          {
              "type": "error",
              "name": "ERC721InvalidSender",
              "inputs": [
                  {
                      "name": "sender",
                      "type": "address",
                      "internalType": "address"
                  }
              ]
          },
          {
              "type": "error",
              "name": "ERC721NonexistentToken",
              "inputs": [
                  {
                      "name": "tokenId",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ]
          },
          {
              "type": "error",
              "name": "ERC721OutOfBoundsIndex",
              "inputs": [
                  {
                      "name": "owner",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "index",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ]
          },
          {
              "type": "error",
              "name": "InvalidShortString",
              "inputs": []
          },
          {
              "type": "error",
              "name": "OwnableInvalidOwner",
              "inputs": [
                  {
                      "name": "owner",
                      "type": "address",
                      "internalType": "address"
                  }
              ]
          },
          {
              "type": "error",
              "name": "OwnableUnauthorizedAccount",
              "inputs": [
                  {
                      "name": "account",
                      "type": "address",
                      "internalType": "address"
                  }
              ]
          },
          {
              "type": "error",
              "name": "StringTooLong",
              "inputs": [
                  {
                      "name": "str",
                      "type": "string",
                      "internalType": "string"
                  }
              ]
          }
      ]
      });

      const voucher = await uploadRequest.json();

      console.log(voucher);
      console.log("Voucher received:", voucher);
      const transaction = prepareContractCall({
        contract,
        method: "safeMint",
        params: [voucher, String(address), BigInt(nft.tokenId)],
      });

      if (account) {
        const { transactionHash } = await sendAndConfirmTransaction({
          account,
          transaction,
        });

        console.log(
          "Minting successfull , transaction hash :",
          transactionHash
        );

        const nftData = {
            userAddress: account.address,
            metaURL: nft.metaUrl,
            contractAddress: contractAddress,
            groupId: id,
        }

        const uploadRequest = await fetch("/api/myNFTs", {
            method: "POST",
            body: JSON.stringify(nftData),
          });

        alert("Minting successfull , check your wallet for transaction status");
      } else {
        alert("Please connect your wallet to mint the NFT");
      }
    } catch (error: any) {
      if (error.message.toLowerCase().includes("invalidsender")) {
        alert("NFT has already been bought. Try another one.");
      } else {
        alert("Error during buy now process");
      }
      console.log("Error during buy now process", error);
    }
  };

  return (
    <div className="flex-grow">
      <main>
        {/* Hero Section */}
        <div
          className="h-80 bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url('/test2.jpg')" }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg text-center">
            {name} NFT Collection
          </h1>
        </div>

        {/* Search and Filter Section */}
        <div className="container mx-auto lg:px-28 px-6 py-8">
          <div className="flex flex-col my-10 lg:mx-20 sm:flex-row gap-4 mb-8 justify-between items-start sm:items-center">
            <Input
              isClearable
              className="w-full md:max-w-[44%]"
              placeholder="Search NFTs..."
              startContent={<Search className="text-default-400" size={20} />}
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <div className="flex gap-2">
              <Button
                isIconOnly
                variant={viewMode === "grid" ? "solid" : "flat"}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid size={20} />
              </Button>
              <Button
                isIconOnly
                variant={viewMode === "list" ? "solid" : "flat"}
                onClick={() => setViewMode("list")}
              >
                <List size={20} />
              </Button>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="capitalize"
                    endContent={<ChevronDownIcon className="text-small" />}
                    variant="flat"
                  >
                    {filter === "all"
                      ? "All Prices"
                      : filter === "below1"
                        ? "Below 1 ETH"
                        : "1 ETH and above"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Filter by price"
                  selectedKeys={[filter]}
                  selectionMode="single"
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setFilter(Array.from(keys)[0] as string)
                  }
                >
                  <DropdownItem key="all">All Prices</DropdownItem>
                  <DropdownItem key="below1">Below 1 ETH</DropdownItem>
                  <DropdownItem key="above1">1 ETH and above</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          {/* NFT Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : nfts.length > 0 ? (
            <div
              className={`grid gap-10 my-10 lg:mx-20 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredNFTs.map((nft, index) => (
                <Card
                  key={index}
                  isPressable
                  className="hover:scale-105 transition-transform"
                >
                  <CardBody className="p-0">
                    <img
                      alt={nft.name}
                      className={`w-full ${viewMode === "grid" ? "h-[300px]" : "h-[200px]"} object-cover`}
                      src={nft.image}
                    />
                  </CardBody>
                  <CardFooter className="flex flex-col items-start">
                    <div className="flex flex-row justify-between items-center w-full">
                    <h3 className="text-lg font-semibold flex">{nft.name}</h3>
                    <p className="text-xs text-gray-400">Token ID: {nft.tokenId}</p></div>
                    <p className="text-default-500">{nft.description}</p>
                    <Button
                      className="w-full mt-2 transition-colors hover:bg-primary-400"
                      color="primary"
                      onClick={() => handleBuyNow(nft, index)}
                    >
                      Mint Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-12 px-24 my-20 mx-auto bg-gray-950  w-fit flex justify-center">
              No items added yet
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
