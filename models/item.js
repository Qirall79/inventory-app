const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
  description: { type: String, required: true, minLength: 3 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true, min: 1 },
  number_in_stock: { type: Number, default: 1 },
  img: {
    data: {
      type: Buffer,
      default: "../uploads/0762ae9c5ddbd5b0e92f23ecec91a98c",
    },
    contentType: { type: String, default: "image/png" },
  },
});

itemSchema.virtual("url").get(function () {
  return `/items/${this._id}`;
});

module.exports = mongoose.model("Item", itemSchema);
