import dbConnect from "@/utils/dbConnect";
import Collection from "@/models/collections";
import { NextRequest, NextResponse } from "next/server";

//write post request to create a new collection
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    const { name, image, id } = await request.json();

    const collection = await Collection.create({
      id,
      name,
      image,
      itemCount: 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Collection created successfully",
        data: collection,
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

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    const collections = await Collection.find();
    console.log(collections);

    return NextResponse.json(
      {
        message: "Collections retrieved successfully",
        data: collections,
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
