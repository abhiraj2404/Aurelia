import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";
import Collection from "@/models/collections";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId"); 

    try {
      await dbConnect();
  
      const collections = await Collection.findOne({id: groupId});
  
      return NextResponse.json(
        {
          message: "Contract address retrieved successfully",
          data: collections.LazymintingContractAddress,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error retrieving data:", error);

      return NextResponse.json(
        { error: "Failed to retrieve collection data" },
        { status: 500 }
      );
    }
  }