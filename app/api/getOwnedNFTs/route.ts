import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";
import axios from "axios";

function extractIpfsHash(url: any) {
  try {
    const ipfsPath = new URL(url).pathname;
    const segments = ipfsPath.split("/");
    const ipfsIndex = segments.indexOf("ipfs");
    if (ipfsIndex !== -1 && segments[ipfsIndex + 1]) {
      return segments[ipfsIndex + 1];
    }
    return null;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const tokenURLs = req.nextUrl.searchParams.get('tokenURLs');
    
    if (!tokenURLs) {
      return NextResponse.json(
        { error: "Missing 'imageURLs' query parameter" },
        { status: 400 }
      );
    }

    const urls = JSON.parse(tokenURLs);
    const metadataPromises = urls.map(async (url: any) => {
      const ipfs_pin_hash = extractIpfsHash(url) || "";
      const { data } = await pinata.gateways.get(ipfs_pin_hash);
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        return data;
      }
    });

    const metadataArray = await Promise.all(metadataPromises);

    return NextResponse.json(metadataArray, { status: 200 });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
