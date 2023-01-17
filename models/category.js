const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, minLength: 3, required: true },
  description: { type: String, minLength: 3, required: true },
});

categorySchema.virtual("url").get(function () {
  return `/categories/${this._id}`;
});

module.exports = mongoose.model("Category", categorySchema);
