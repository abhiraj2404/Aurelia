"use client";
import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

function HeroSection() {
  return (
    <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          fill
          priority
          alt="College Graduation"
          className="object-cover"
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-indigo-900/90" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold mb-6 text-white tracking-tight">
            Your College Memories,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Forever Digital
            </span>
          </h1>
          <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Transform your cherished farewell photos into unique NFTs,
            preserving your college memories eternally on the blockchain.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all"
              size="lg"
              onClick={() => (window.location.href = "/myNFTs")}
            >
              Start Minting
            </Button>
            <Button
              className="text-white border-white hover:bg-white/10"
              size="lg"
              variant="bordered"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HeroSection;
