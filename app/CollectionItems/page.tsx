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
import { sendTransaction, prepareContractCall } from "thirdweb";
import { contract } from "@/config/client";
import { Spinner } from "@nextui-org/spinner";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function CollectionsPage() {
  interface NFT {
    id: number;
    name: string;
    price: string;
    description: string;
    image: string;
    metaUrl: string;
  }
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const name = searchParams.get("name");

  const [nfts, setNfts] = useState<NFT[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("all");
  const account = useActiveAccount();
  const address = useActiveAccount()?.address;

  useEffect(() => {
    async function fetchNFTs() {
      try {
        const response = await axios.get("/api/getNFTs", {
          params: {
            id: id,
          },
        });

        const metadataFiles = response.data;
        console.log("metadataFiles", metadataFiles);
        setNfts(metadataFiles);
      } catch (error) {
        console.log("Error fetching NFTs:", error);
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
      };
      const uploadRequest = await fetch("/api/getVoucher", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const voucher = await uploadRequest.json();
      console.log("Voucher received:", voucher);
      const transaction = prepareContractCall({
        contract,
        method: "safeMint",
        params: [voucher, String(address)],
      });

      if (account) {
        const { transactionHash } = await sendTransaction({
          account,
          transaction,
        });
        console.log(
          "Minting successfull , transaction hash :",
          transactionHash
        );
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
                variant={viewMode === "grid" ? "solid" : "flat"}
                isIconOnly
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid size={20} />
              </Button>
              <Button
                variant={viewMode === "list" ? "solid" : "flat"}
                isIconOnly
                onClick={() => setViewMode("list")}
              >
                <List size={20} />
              </Button>
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
          </div>

          {/* NFT Grid */}
          {nfts.length > 0 ? (
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
                  className="hover:scale-105 transition-transform"
                  isPressable
                >
                  <CardBody className="p-0">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className={`w-full ${viewMode === "grid" ? "h-[300px]" : "h-[200px]"} object-cover`}
                    />
                  </CardBody>
                  <CardFooter className="flex flex-col items-start">
                    <h3 className="text-lg font-semibold">{nft.name}</h3>
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
            <div className="py-12 w-full flex justify-center">
              <Spinner />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
