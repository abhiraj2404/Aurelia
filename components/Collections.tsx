"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useRouter } from "next/navigation";
import React from "react";

function Collections() {
  const router = useRouter();
  const collections = [
    {
      id: "2023",
      name: "Class of 2023",
      imageUrl: "/test.jpg",
    },
    {
      id: "2024",
      name: "Class of 2024",
      imageUrl: "/test.jpg",
    },
    {
      id: "2025",
      name: "Class of 2025",
      imageUrl: "/test.jpg",
    },
  ];
  return (
    <div className="container mx-auto px-10 lg:px-32 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">NFT Collections</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
        {collections.map((collection) => (
          <Card
            key={collection.id}
            onPress={() => console.log(`Clicked ${collection.name}`)}
            className="transition-all hover:scale-105 hover:shadow-lg"
          >
            <CardBody className="p-0">
              <Image
                src={collection.imageUrl}
                alt={collection.name}
                className="w-full "
              />
            </CardBody>
            <CardFooter className="flex flex-col items-start">
              <h3 className="text-xl font-semibold">{collection.name}</h3>
              <Button
                color="primary"
                variant="flat"
                size="sm"
                className="mt-2 transition-colors hover:bg-primary-400"
                onPress={() => router.push(`/collections?id=${collection.id}`)}
              >
                View Collection
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Collections;
