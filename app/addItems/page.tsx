"use client";

import { useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface FileWithPreview extends File {
  preview?: string;
}

interface ValidationError {
  message: string;
  type: "error" | "warning";
}

export default function AddItemsPage() {
  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [metadataFile, setMetadataFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const searchParams = useSearchParams();
  const collectionName = searchParams.get("name");
  const collectionId = searchParams.get("id");

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const newImages = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setImages((prev) => [...prev, ...newImages]);
    setErrors([]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);
    const newImages = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setImages((prev) => [...prev, ...newImages]);
    setErrors([]);
  };

  const handleMetadataSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setMetadataFile(e.target.files[0]);
    setErrors([]);
  };

  const validateCSV = async (file: File): Promise<ValidationError[]> => {
    const errors: ValidationError[] = [];
    const text = await file.text();
    const lines = text.split("\n").filter((line) => line.trim());

    // Check header
    const header = lines[0].toLowerCase();
    if (
      !header.includes("tokenid") ||
      !header.includes("name") ||
      !header.includes("description") ||
      !header.includes("file_name")
    ) {
      errors.push({
        message: "CSV must have headers: tokenID, name, description, file_name",
        type: "error",
      });
      return errors;
    }

    // Get column indexes
    const headers = header.split(",");
    const tokenIdIndex = headers.indexOf("tokenid");
    const fileNameIndex = headers.indexOf("file_name");

    // Check data rows
    const imageFileNames = new Set(images.map((img) => img.name));
    const tokenIds = new Set<number>();

    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(",");

      // Check tokenID
      const tokenId = parseInt(columns[tokenIdIndex]);
      if (isNaN(tokenId)) {
        errors.push({
          message: `Invalid tokenID at row ${i + 1}`,
          type: "error",
        });
        continue;
      }

      if (tokenIds.has(tokenId)) {
        errors.push({
          message: `Duplicate tokenID ${tokenId} at row ${i + 1}`,
          type: "error",
        });
      }
      tokenIds.add(tokenId);

      // Check if tokenIDs are consecutive
      if (tokenId !== i) {
        errors.push({
          message: `TokenIDs must be consecutive numbers starting from 1. Found ${tokenId} at row ${i + 1}`,
          type: "error",
        });
      }

      // Check if image exists
      const fileName = columns[fileNameIndex].trim();
      if (!imageFileNames.has(fileName)) {
        errors.push({
          message: `Image file "${fileName}" not found in uploaded images`,
          type: "error",
        });
      }
    }

    // Check if all images are referenced
    images.forEach((img) => {
      if (!text.includes(img.name)) {
        errors.push({
          message: `Uploaded image "${img.name}" is not referenced in the CSV`,
          type: "warning",
        });
      }
    });

    return errors;
  };

  const handleUpload = async () => {
    setErrors([]);

    if (!images.length) {
      setErrors([
        { message: "Please upload at least one image", type: "error" },
      ]);
      return;
    }

    if (!metadataFile) {
      setErrors([
        { message: "Please upload a metadata CSV file", type: "error" },
      ]);
      return;
    }

    setIsUploading(true);
    try {
      const validationErrors = await validateCSV(metadataFile);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      //Implement actual upload logic here

      console.log("Uploading files...");
    } catch (error) {
      setErrors([
        {
          message: "An error occurred while validating the files",
          type: "error",
        },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Add Items</h1>
        {collectionName && (
          <span className="text-xl text-gray-400">for {collectionName}</span>
        )}

        <div className="bg-[#1B1B1B] rounded-lg p-6">
          <div className="space-y-6">
            {/* Image Upload Section */}
            <div
              className={`border-2 border-dashed border-gray-600 rounded-lg p-8 transition-colors cursor-pointer ${
                isDragging
                  ? "border-blue-500 bg-blue-500/10"
                  : "hover:border-gray-500"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleImageDrop}
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-800 rounded-lg">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Select media</h3>
                  <p className="text-sm text-gray-400">
                    Drag and drop or click to select up to 100 media files, up
                    to a total size of 1GB. JPG, PNG, SVG, and GIF are
                    supported.
                  </p>
                </div>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={handleImageSelect}
              />
            </div>

            {/* Preview Section */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((file, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-800"
                  >
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Metadata Upload Section */}
            <div
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-gray-500 transition-colors cursor-pointer"
              onClick={() =>
                document.getElementById("metadata-upload")?.click()
              }
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-800 rounded-lg">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Select metadata</h3>
                    <span className="text-sm text-gray-400">Required</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Upload a CSV file with columns: tokenID, name, description,
                    file_name
                  </p>
                  <p className="text-xs text-gray-400">
                    Note: name of image file should be the same as name proved
                    in csv file
                  </p>
                </div>
              </div>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                id="metadata-upload"
                onChange={handleMetadataSelect}
              />
            </div>

            {/* Selected Metadata File */}
            {metadataFile && (
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm">Selected: {metadataFile.name}</p>
              </div>
            )}

            {/* Validation Errors */}
            {errors.length > 0 && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 space-y-2">
                {errors.map((error, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span
                      className={
                        error.type === "warning"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }
                    >
                      {error.message}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={isUploading || !images.length || !metadataFile}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                isUploading || !images.length || !metadataFile
                  ? "bg-blue-600/50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload Collection"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
