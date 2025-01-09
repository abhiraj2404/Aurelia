import dbConnect from "@/utils/dbConnect";
import User from "@/models/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const { userAddress, metaURL, contractAddress, groupId } = await req.json();

  const user = await User.create({
    userAddress,
    metaURL,
    contractAddress,
    groupId
  });
  
  return NextResponse.json(user, { status: 200 });
}

export async function GET(req: NextRequest) {
  const userAddress = req.nextUrl.searchParams.get('userAddress');

  const data = await User.find({userAddress});
  console.log(data);

  return NextResponse.json(data, { status: 200 });
}