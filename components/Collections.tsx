"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Collections() {
  const router = useRouter();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setIsloading] = useState(false);

  //add logic to dynamically fetch collections from database
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

  return (
    <div className="container mx-auto px-10 lg:px-32 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">NFT Collections</h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
        {collections.map((collection) => (
          <Card
            key={collection.id}
            onPress={() => console.log(`Clicked ${collection.name}`)}
            className="transition-all hover:scale-105 hover:shadow-lg"
          >
            
            <CardBody className="p-0 aspect-video relative overflow-hidden">
              <Image
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
            </CardBody>
            <CardFooter className="flex flex-col items-start">
              <h3 className="text-xl font-semibold">{collection.name}</h3>
              <Button
                color="primary"
                variant="flat"
                size="sm"
                className="mt-2 transition-colors hover:bg-primary-400"
                onPress={() =>
                  router.push(
                    `/CollectionItems?name=${collection.name}&id=${collection.id}`
                  )
                }
              >
                View Collection
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}

export default Collections;
