"use client";

import { useRef, useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Input, Textarea } from "@nextui-org/input";
import { Upload } from "lucide-react";
import { Select, SelectItem } from "@nextui-org/select";
import { useRouter } from "next/navigation";

export default function AddPage() {
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    collection: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const collections = [
    { label: "Collection 1", value: "collection1" },
    { label: "Collection 2", value: "collection2" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setFile(e.target?.files?.[0]);
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");

        return;
      }

      const data = new FormData();

      data.set("file", file, formData.name);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const signedUrl = await uploadRequest.json();

      setUrl(signedUrl);

      return signedUrl;
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const uploadMetadata = async (metadata: object) => {
    try {
      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      });

      const metadataFormData = new FormData();

      metadataFormData.set(
        "file",
        metadataBlob,
        `metadata-${formData.name}.json`
      );

      const metadataUploadRequest = await fetch("/api/files", {
        method: "POST",
        body: metadataFormData,
      });

      if (!metadataUploadRequest.ok)
        throw new Error("Failed to upload metadata");

      alert("Metadata uploaded successfully!");
    } catch (e) {
      console.error("Error uploading metadata:", e);
      alert("Trouble uploading metadata");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    const imageURL = await uploadFile();

    if (imageURL) {
      const metadata = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        image: imageURL,
      };

      await uploadMetadata(metadata);
      setUploading(false);
      console.log("Form submitted:", formData);
      router.push("/myCollections");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 flex-grow">
      <h1 className="text-4xl font-bold mb-2">Create an NFT</h1>
      <p className="text-default-500 mb-8">
        Once your item is minted you will not be able to change any of its
        information.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card>
          <CardBody className="gap-6">
            {/* Image Upload Section */}
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    alt="NFT Preview"
                    className="max-h-[400px] mx-auto rounded-lg"
                    src={imagePreview}
                  />
                  <Button
                    className="absolute top-2 right-2"
                    color="primary"
                    variant="flat"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8" />
                  <div className="text-lg font-semibold">
                    Drag and drop media
                  </div>
                  <div className="text-sm text-default-500">Browse files</div>
                  <div className="text-xs text-default-400">
                    Max size: 50MB
                    <br />
                    JPG, PNG, GIF, SVG, MP4
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                accept="image/*,video/mp4"
                className="hidden"
                type="file"
                onChange={handleImageUpload}
              />
            </div>

            {/* Collection Selection */}
            <Select
              isRequired
              label="Collection"
              labelPlacement="outside"
              placeholder="Choose a collection"
              value={formData.collection}
              onChange={(e) =>
                setFormData({ ...formData, collection: e.target.value })
              }
            >
              {collections.map((collection) => (
                <SelectItem key={collection.value} value={collection.value}>
                  {collection.label}
                </SelectItem>
              ))}
            </Select>

            {/* NFT Details */}
            <Input
              isRequired
              label="Name"
              labelPlacement="outside"
              placeholder="Name your NFT"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <Textarea
              label="Description"
              labelPlacement="outside"
              placeholder="Provide a detailed description of your NFT"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <Input
              isRequired
              label="Price (ETH)"
              labelPlacement="outside"
              placeholder="Set your price"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">Ξ</span>
                </div>
              }
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />

            <Button
              className="w-full"
              color="primary"
              disabled={uploading}
              size="lg"
              type="submit"
            >
              {uploading ? "Creating..." : "Create NFT"}
            </Button>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}
