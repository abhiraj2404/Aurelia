import { NextApiRequest, NextApiResponse } from "next";
import { pinata } from "@/utils/config";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { files } = await pinata.files.list(); // Get list of files
    console.log("Files:", files);
    const jsonFiles = files.filter((file) => file.name?.endsWith(".json"));

    const metadataPromises = jsonFiles.map(async (file) => {
      const { data, contentType } = await pinata.gateways.get(`${file.cid}`);
      console.log("Data:", data);
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
