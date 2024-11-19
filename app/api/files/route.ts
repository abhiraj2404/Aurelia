import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    const uploadData = await pinata.upload
      .file(file, {
        metadata: {
          name: file.name,
          keyvalues: {
            folderPath: "collection1", // Custom metadata to track folder (optional)
          },
        },
      })
      .group("01933bba-e1df-7077-a3f1-9bb5192060f0");

    const url = `https://${process.env.PINATA_GATEWAY_URL}/files/${uploadData.cid}`;
    return NextResponse.json(url, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
