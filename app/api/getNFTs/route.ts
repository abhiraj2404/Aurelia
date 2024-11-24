import { NextApiRequest, NextApiResponse } from "next";
import { pinata } from "@/utils/config";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest, res: NextResponse) {
  try {  
    const _cookies = cookies();
    const files = await pinata.listFiles().group('2c83451b-83a7-416c-b21b-7ba3fa3547d7'); // Get list of files
    const jsonFiles = files.filter((file) => file.metadata.name?.endsWith(".json"));

    const metadataPromises = jsonFiles.map(async (file) => {
      const { data } = await pinata.gateways.get(`${file.ipfs_pin_hash}`);
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        return {
          ...data!,
          metaUrl: `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${file.ipfs_pin_hash}`
        };
      }
    });

    const metadataFiles = await Promise.all(metadataPromises);
    return NextResponse.json(metadataFiles, { status: 200 });
  } catch (error) {
    console.error("Error fetching Pinata files:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
