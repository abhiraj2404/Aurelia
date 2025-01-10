import { NextResponse, type NextRequest } from "next/server";

import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const groupId: string = data.get("id") ? (data.get("id") as string) : "2c83451b-83a7-416c-b21b-7ba3fa3547d7";

    const uploadData = await pinata.upload
      .file(file)
      .addMetadata({
        name: file.name,
        keyValues: {
          folderPath: "collection3",
        },
      })
      .group(groupId);

    const url = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${uploadData.IpfsHash}`;

    const pinjob = await pinata
      .pinJobs()
      .cid(`${uploadData.IpfsHash}`)

    return NextResponse.json(url, { status: 200 });
  } catch (e) {
    console.log(e);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
