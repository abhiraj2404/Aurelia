import { NextRequest, NextResponse } from "next/server";

import Signature from "@/models/signatures";


export async function POST(req: NextRequest, res: NextResponse) {
  const { tokenId, studentName, uri, groupId } = await req.json();
  const voucher = { tokenId, studentName, uri };

  console.log(voucher);
  const types = {
    LazyMintVoucher: [
      { name: "tokenId", type: "uint256" },
      { name: "studentName", type: "string" },
      { name: "uri", type: "string" },
    ],
  };

  const data = await Signature.findOne({groupId, metaURL: uri});
  const signature = data.signature;

  return NextResponse.json({ ...voucher, signature }, { status: 200 });
}
