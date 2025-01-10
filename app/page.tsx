"use client";

import { Button } from "@nextui-org/button";

import HeroSection from "@/components/heroSection";
import Collections from "@/components/Collections";

export default function Home() {
  return (
    <div className=" bg-background">
      <HeroSection />
      <Collections />

      {/* how it works  */}
      <section className="bg-gray-900 py-16">
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
      </section>

      {/* testimonials  */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16">
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
      </section>
    </div>
  );
}
