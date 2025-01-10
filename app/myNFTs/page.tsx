"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Search, List, LayoutGrid, Settings } from "lucide-react";
import { Avatar } from "@nextui-org/avatar";
import { useActiveAccount } from "thirdweb/react";
import axios from "axios";
import { Spinner } from "@nextui-org/spinner";

const mockNFTs = [
  {
    id: 1,
    name: "Senior Memories #001",
    description: "Graduation ceremony moments captured forever",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 2,
    name: "College Days #042",
    description: "Last day in the campus library",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 3,
    name: "Farewell Party #013",
    description: "Group photo with classmates",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 4,
    name: "Farewell Party #013",
    description: "Group photo with classmates",
    image: "/placeholder.svg?height=400&width=400",
  },
  // Add more NFTs as needed
];

export default function MyNFTsPage() {
  interface NFT {
    id: number;
    name: string;
    price: string;
    description: string;
    image: string;
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const address = useActiveAccount()?.address;
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  // const { data, isLoading } = useReadContract({
  //   contract,
  //   method: "getAllOwnedNfts",
  //   params: [String(address)],
  // });

  // useEffect(() => {
  //   if (data) setOwnedNfts(data);
  //   setLoading(false);
  // }, [data]);

  useEffect(() => {
    if(address) {
      fetch();
    }
  },[address])

  const fetch = async () => {
    try {
      const response1 = await axios.get("/api/myNFTs", {
        params: {
          userAddress: address,
        }
      });

      interface nftdata {
        userAddress: string;
        metaURL: string;
        contractAddress: string;
        groupId: string;
      }

      const data: nftdata[] = response1.data;
      const ownedNfts: string[] = [];

      data.map((d: nftdata,_) => {
        ownedNfts.push(d.metaURL);
      })

      console.log(ownedNfts);

      const response = await axios.get("/api/getOwnedNFTs", {
        params: {
          tokenURLs: JSON.stringify(ownedNfts),
        },
      });

      setNfts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  const filteredNFTs = nfts.filter((nft) =>
    nft.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-grow bg-background p-8">
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar
          className="w-24 h-24"
          src="/placeholder.svg?height=100&width=100"
        />
        <div>
          <h1 className="text-2xl font-bold">Unnamed</h1>
          <p className="text-default-500 font-mono">
            {address
              ? `${address.slice(0, 6)}.....${address.slice(-5)}`
              : "Connect your wallet"}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col my-10 lg:mx-20 sm:flex-row gap-4 mb-8 justify-between items-start sm:items-center">
        <Input
          className="w-full sm:w-[400px]"
          placeholder="Search your NFTs..."
          startContent={<Search className="text-default-400" size={20} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
              <Button isIconOnly variant="flat">
                <Settings size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="View options">
              <DropdownItem key={""}>Sort by Name</DropdownItem>
              <DropdownItem key={""}>Sort by Recent</DropdownItem>
              <DropdownItem key={""}>Filter by Collection</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* NFT Grid */}
      <div
        className={`grid gap-10 my-10 lg:mx-20 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        {filteredNFTs.reverse().map((nft, index) => (
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
              <h3 className="text-lg font-semibold">{nft.name}</h3>
              <p className="text-default-500">{nft.description}</p>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* empty state  */}
      {address ? (
        loading ? (
          <div className="text-center py-12">
            <Spinner />
          </div>
        ) : (
          filteredNFTs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-default-500">
                No NFTs found matching your search.
              </p>
            </div>
          )
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-default-500">
            Connect your wallet to view your NFTs
          </p>
        </div>
      )}
    </div>
  );
}
