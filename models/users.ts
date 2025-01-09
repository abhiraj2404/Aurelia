import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userAddress: { type: String, required: true },
  metaURL: { type: String, required: true },
  contractAddress: { type: String, required: true },
  groupId: { type: String, required: true },
});

const Signature =
  mongoose.models.User || mongoose.model("User", UserSchema);

export default Signature;
