"use client";

import { useEffect, useState } from "react";
import { Plus, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { prepareContractCall, prepareEvent, getContractEvents, sendAndConfirmTransaction } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { EventContract, client } from "@/config/client";
import { Spinner } from "@nextui-org/spinner";
export default function CollectionsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const wallet = useActiveAccount();
  // const account = await wallet.connect({ client });
  const [isCreating, setIsCreating] = useState(false);

  //add logic to fetch collections from database with the help of useEffect
  const [collections, setCollections] = useState<any[]>([]);
  const { mutate: sendTransaction } = useSendTransaction();
  const [loading, setIsloading] = useState(false);

  const fetchCollections = async () => {
    setIsloading(true);
    try {
      const response = await fetch("/api/collections");
      const res = await response.json();
      console.log(res.data);
      setCollections(res.data);
      setIsloading(false);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setIsloading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const [newCollection, setNewCollection] = useState({
    name: "",
    image: null as File | null,
  });

  const uploadFile = async (file: any, name: string) => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }

      const data = new FormData();
      data.set("file", file, name);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const signedUrl = await uploadRequest.json();
      return signedUrl;
    } catch (e) {
      console.log(e);
      alert("Trouble uploading file");
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    if (!newCollection.name || !newCollection.image) {
      setIsCreating(false);
      return;
    }

    //add logic to send the new collection to the server
    try {
      const transaction = prepareContractCall({
        contract: EventContract,
        method: "function addNewEvent(address minter)",
        params: [wallet?.address || ""],
      });
      if (!wallet) {
        alert("Wallet not connected");
        setIsCreating(false);
        return;
      }
      const preparedEvent = prepareEvent({
        signature:
          "event NewEventCreated(address organizer, address contractAddress)",
      });
      const trax = await sendAndConfirmTransaction({
        transaction,
        account: wallet,
      });
      console.log("Transaction sent:", trax);

      const events = await getContractEvents({
        contract: EventContract,
        events: [preparedEvent],
        fromBlock: trax.blockNumber,
        toBlock: "latest",
      });
      const LazymintingContractAddress = events[0]?.args?.contractAddress;
      console.log(LazymintingContractAddress)

      console.log("Events found:", events);
      const imagefile = newCollection.image;
      const imageUrl = await uploadFile(imagefile, newCollection.name);

      const res = await axios.post("/api/collections", {
        name: newCollection.name,
        image: imageUrl,
        LazymintingContractAddress: LazymintingContractAddress,
      });

      if (res.data.success) {

        alert("collection created success")
        fetchCollections();
        console.log(res.data);
        setIsCreating(false);
      } else {
        alert(`Failed to create collection: ${res.data.error}`);
        setIsCreating(false);
      }
    } catch (error) {
      console.log("error creating collecion", error);
      setIsCreating(false);
      alert("error creating collection");
    }
    setIsCreating(false);


    setNewCollection({ name: "", image: null });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Collections</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create New Collection
          </button>
        </div>

        {/* Collections Grid */}
          {loading ? (<div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>) :(<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-[#1B1B1B] rounded-lg overflow-hidden"
            >
              <div className="aspect-video relative">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {collection.name}
                </h3>
                {/* <p className="text-gray-400 mb-4">
                  {collection.itemCount} items
                </p> */}
                <div className="flex justify-start items-center gap-2 *:flex-grow">
                  <Link
                    href={`/addItems?name=${collection.name}&id=${collection.id}`}
                    className="inline-block text-center py-2 px-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors "
                  >
                    Add Items
                  </Link>
                  <Button
                    color="primary"
                    variant="flat"
                    className="transition-colors hover:bg-primary-400"
                    onPress={() =>
                      router.push(
                        `/CollectionItems?name=${collection.name}&id=${collection.id}`
                      )
                    }
                  >
                    View Collection
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>) }

        {/* Create Collection Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-[#1B1B1B] rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Create New Collection</h2>
              <form onSubmit={handleCreateCollection} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    value={newCollection.name}
                    onChange={(e) =>
                      setNewCollection((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#2B2B2B] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Collection Image
                  </label>
                  <div
                    onClick={() =>
                      document.getElementById("collection-image")?.click()
                    }
                    className="border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors cursor-pointer"
                  >
                    {newCollection.image ? (
                      <img
                        src={URL.createObjectURL(newCollection.image)}
                        alt="Preview"
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <ImageIcon className="h-8 w-8" />
                        <span>Click to upload collection image</span>
                      </div>
                    )}
                    <input
                      type="file"
                      id="collection-image"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setNewCollection((prev) => ({
                            ...prev,
                            image: e.target.files![0],
                          }));
                        }
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 px-4 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-2 px-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors${
                      isCreating
                        ? "bg-blue-600/50 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={isCreating}
                  >
                    {isCreating ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
