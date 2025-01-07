import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  itemCount: { type: Number, required: true, default: 0 },
});

const Collection =
  mongoose.models.Collection || mongoose.model("Collection", CollectionSchema);

export default Collection;
