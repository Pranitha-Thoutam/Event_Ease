const mongoose = require("mongoose");

const eventCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
      default: "/images/categories/placeholder.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventCategory", eventCategorySchema); 