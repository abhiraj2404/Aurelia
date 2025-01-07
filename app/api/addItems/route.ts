import dbConnect from "@/utils/dbConnect";
import Signature from "@/models/signatures";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { groupId, metaURL, sig } = await request.json();

    await dbConnect();

    const signature = await Signature.create({
      groupId,
      metaURL,
      signature: sig,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Collection created successfully",
        data: signature,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create collection" },
      { status: 500 }
    );
  }
}
