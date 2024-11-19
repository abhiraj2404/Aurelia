import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";

const SIGN_DOMAIN = "IIIT SRICITY";
const SIGN_VERSION = "1";
const chainId = 421614;
const contractAddress = process.env.CONTRACT_ADDRESS; // Put the address here from remix
const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string); // private key that I use for address 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
console.log(contractAddress,signer);
const domain = {
  name: SIGN_DOMAIN,
  version: SIGN_VERSION,
  verifyingContract: contractAddress,
  chainId,
};

export async function POST(req: NextRequest, res: NextResponse) {
  const { tokenId, studentName, uri } = await req.json();
  const voucher = { tokenId, studentName, uri };
  const types = {
    LazyMintVoucher: [
      { name: "tokenId", type: "uint256" },
      { name: "studentName", type: "string" },
      { name: "uri", type: "string" },
    ],
  };

  const signature = await signer.signTypedData(domain, types, voucher);
  return NextResponse.json({ ...voucher, signature }, { status: 200 });
}
