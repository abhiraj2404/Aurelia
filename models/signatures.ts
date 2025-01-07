import mongoose from "mongoose";

const SignatureSchema = new mongoose.Schema({
  groupId: { type: String, required: true },
  metaURL: { type: String, required: true },
  signature: { type: String, required: true },
});

const Signature =
  mongoose.models.Signature || mongoose.model("Signature", SignatureSchema);

export default Signature;
