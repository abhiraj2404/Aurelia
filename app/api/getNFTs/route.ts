import { NextApiRequest, NextApiResponse } from "next";
import { pinata } from "@/utils/config";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const _cookies = cookies();
    const { files } = await pinata.files.list(); // Get list of files
    const jsonFiles = files.filter((file) => file.name?.endsWith(".json"));

    const metadataPromises = jsonFiles.map(async (file) => {
      const { data } = await pinata.gateways.get(`${file.cid}`);
      return data;
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
