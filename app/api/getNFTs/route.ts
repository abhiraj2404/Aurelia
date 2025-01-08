import { NextApiRequest, NextApiResponse } from "next";
import { pinata } from "@/utils/config";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const _cookies = cookies();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    
    console.log("get req received for id",id);
    if (id === null) {
      throw new Error("No id provided");
    }

    const files = await pinata.listFiles().pageLimit(100).group(id); // Get list of files
    console.log("files from backend fetched");

    const jsonFiles = files.filter((file) =>
      file.metadata.name?.endsWith(".json")
    );

    const metadataPromises = jsonFiles.map(async (file) => {
      const { data } = await pinata.gateways.get(`${file.ipfs_pin_hash}`);
      if (data && typeof data === "object" && !Array.isArray(data)) {
        return {
          ...data!,
          metaUrl: `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${file.ipfs_pin_hash}`,
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
