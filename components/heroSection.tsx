"use client"
import { Button } from "@nextui-org/button";
import React from "react";

function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Preserve Your College Memories
        </h1>
        <p className="text-xl mb-8">
          Mint your farewell photos as unique NFTs and keep them forever on the
          blockchain.
        </p>
        <Button
          size="lg"
          color="secondary"
          className="transition-all hover:scale-105 hover:bg-secondary-400"
        >
          Learn How to Mint
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
