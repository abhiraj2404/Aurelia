"use client";

import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";
import { GraduationCap, Shield, Wallet } from "lucide-react";
import Image from "next/image";
import { Card } from "@nextui-org/card";

import Collections from "@/components/Collections";
import HeroSection from "@/components/heroSection";

export default function Home() {
  return (
    <div className=" bg-background">
      <HeroSection />

      {/* how to works  */}
      <section className="py-32 mx-40 bg-black/95">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-24 text-white">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-28 ">
            {[
              {
                icon: <Wallet className="w-8 h-8" />,
                title: "Connect Wallet",
                description:
                  "Link your digital wallet or create a new one to get started with our platform",
              },
              {
                icon: <GraduationCap className="w-8 h-8" />,
                title: "Mint Your Memories",
                description:
                  "Upload your photos and transform them into unique digital assets on the blockchain",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Preserve Forever",
                description:
                  "Your memories are now securely stored and can be accessed anywhere, anytime",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative p-8 rounded-2xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 mt-4 text-white text-center">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-center px-4">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Collections />

      <section className="py-36 mx-40 bg-gradient-to-b from-black/95 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Alumni Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Priya Sharma",
                batch: "2023",
                quote:
                  "Minting my farewell photos as NFTs was the perfect way to preserve my college memories. The process was seamless!",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
              },
              {
                name: "Rahul Patel",
                batch: "2022",
                quote:
                  "Having my college memories as NFTs feels special. It is like carrying a piece of my university life in my digital wallet.",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
              },
              {
                name: "Rahul Patel",
                batch: "2022",
                quote:
                  "Having my college memories as NFTs feels special. It is like carrying a piece of my university life in my digital wallet.",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
              },
              {
                name: "Priya Sharma",
                batch: "2023",
                quote:
                  "Minting my farewell photos as NFTs was the perfect way to preserve my college memories. The process was seamless!",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                isPressable
                className="bg-gray-800/30 border border-gray-800"
              >
                <motion.div
                  key={index}
                  className="p-8 rounded-2xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-800"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        fill
                        alt={testimonial.name}
                        className="object-cover"
                        src={testimonial.image}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-400">
                        Class of {testimonial.batch}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 italic text-left">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </motion.div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* how it works  */}
      {/* <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              {
                title: "Create your accouunt",
                description:
                  "Connect your wallet or create a new one by clicking on connect",
              },
              {
                title: "Mint an NFT",
                description:
                  "Convert your photo into a unique digital asset on the blockchain",
              },
              {
                title: "Preserve Forever",
                description:
                  "Keep your college memories safe and accessible for years to come",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-indigo-400">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {step.title}
                </h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* testimonials  */}
      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-white">
          What Our Alumni Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: "Priya Sharma",
              batch: "2023",
              quote:
                "Minting my farewell photo as an NFT was the perfect way to preserve my IIITS memories!",
            },
            {
              name: "Rahul Patel",
              batch: "2022",
              quote:
                "I love being able to showcase my college NFTs in my digital wallet. It is like carrying a piece of IIITS with me everywhere.",
            },
            {
              name: "Rahul Patel",
              batch: "2022",
              quote:
                "I love being able to showcase my college NFTs in my digital wallet. It is like carrying a piece of IIITS with me everywhere.",
            },
            {
              name: "Priya Sharma",
              batch: "2023",
              quote:
                "Minting my farewell photo as an NFT was the perfect way to preserve my IIITS memories!",
            },
          ].map((testimonial, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md">
              <p className="text-gray-300 mb-4">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-indigo-400">
                    {testimonial.name[0]}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-400">Batch of {testimonial.batch}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Preserve Your College Memories?
            </h2>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Don&apos;t let your precious moments fade away. Start your digital
              preservation journey today.
            </p>
            <Button
              className="bg-white text-purple-900 hover:bg-gray-100 font-semibold"
              size="lg"
              onClick={() => (window.location.href = "/myNFTs")}
            >
              Start Minting Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Preserve Your IIITS Memories?
          </h2>
          <p className="text-xl mb-8">
            Don&apos;t let your college moments fade away. Mint your NFTs today!
          </p>
          <Button
            color="secondary"
            size="lg"
            onClick={() => (window.location.href = "/myNFTs")}
          >
            Get Started
          </Button>
        </div>
      </section> */}
    </div>
  );
}
