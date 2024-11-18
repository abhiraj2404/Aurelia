"use client";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { useActiveAccount } from "thirdweb/react";
import { sendTransaction } from "thirdweb";

export default function CollectionsPage() {
  // const nfts = [

  //   {
  //     id: 1,
  //     name: "Cool Cat #1",
  //     price: "0.5 ETH",
  //     image: "/placeholder.svg?height=400&width=400",
  //   },
  //   {
  //     id: 2,
  //     name: "Bored Ape #42",
  //     price: "2.5 ETH",
  //     image: "/placeholder.svg?height=400&width=400",
  //   },
  //   {
  //     id: 3,
  //     name: "Crypto Punk #007",
  //     price: "5 ETH",
  //     image: "/placeholder.svg?height=400&width=400",
  //   },
  //   {
  //     id: 4,
  //     name: "Doodle #123",
  //     price: "0.8 ETH",
  //     image: "/placeholder.svg?height=400&width=400",
  //   },
  //   {
  //     id: 5,
  //     name: "Azuki #456",
  //     price: "1.2 ETH",
  //     image: "/placeholder.svg?height=400&width=400",
  //   },
  //   {
  //     id: 6,
  //     name: "World of Women #789",
  //     price: "0.6 ETH",
  //     image: "/placeholder.svg?height=400&width=400",
  //   },
  // ];

  interface NFT {
    id: number;
    name: string;
    price: string;
    image: string;
  }

  const [nfts, setNfts] = useState<NFT[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const account = useActiveAccount();

  console.log("Active account:", account);

  console.log("User address:", account?.address);

  useEffect(() => {
    async function fetchNFTs() {
      try {
        // Fetch files from your backend
        const response = await fetch("/api/getNFTs"); // Replace with your API route
        if (!response.ok) throw new Error("Failed to fetch NFT data");

        const metadataFiles = await response.json(); // Expecting array of metadata JSON
        setNfts(metadataFiles);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    }

    fetchNFTs();
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
        tokenId: index,
        studentName: nft.name,
        uri: nft.image,
      };
      const uploadRequest = await fetch("/api/getVoucher", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!uploadRequest.ok) {
        throw new Error("Failed to fetch voucher");
      }

      const voucher = await uploadRequest.json();
      console.log("Voucher received:", voucher);

      const mintRequest = await fetch("/api/mintNFT", {
        method: "POST",
        body: JSON.stringify({ voucher, account }),
      });
      const mintResponse = await mintRequest.json();
      const transaction = mintResponse.transaction;
      console.log("transaction - " , transaction);

      if (account) {
        const { transactionHash } = await sendTransaction({
          account,
          transaction,
        });
        console.log(
          "Minting successfull , transaction hash :",
          transactionHash
        );
      }
    } catch (error) {
      console.error("Error during Buy Now process:", error);
    }
  };

  return (
    <div>
      <main className="flex-grow">
        {/* Hero Section */}
        <div
          className="h-80 bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url('/test2.jpg')" }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg text-center">
            Class of 2023 NFT Collection
          </h1>
        </div>

        {/* Search and Filter Section */}
        <div className="container mx-auto lg:px-40 px-6 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Input
              isClearable
              className="w-full md:max-w-[44%]"
              placeholder="Search NFTs..."
              startContent={<SearchIcon />}
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  className="capitalize"
                  endContent={<ChevronDownIcon className="text-small" />}
                >
                  {filter === "all"
                    ? "All Prices"
                    : filter === "below1"
                      ? "Below 1 ETH"
                      : "1 ETH and above"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Filter by price"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={[filter]}
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

          {/* NFT Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
            {filteredNFTs.map((nft, index) => (
              <Card
                key={index}
                className="max-w-[300px] transition-all hover:scale-105 hover:shadow-lg"
              >
                <CardBody className="p-0">
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    width="100%"
                    height={200}
                  />
                </CardBody>
                <CardFooter className="flex-col items-start">
                  <h4 className="font-bold text-large">{nft.name}</h4>
                  <p className="text-default-500">{nft.price} ETH</p>
                  <Button
                    className="w-full mt-2 transition-colors hover:bg-primary-400"
                    color="primary"
                    onClick={() => handleBuyNow(nft, index)}
                  >
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
