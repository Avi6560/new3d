const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: "User" },
    items: [
      {
        _id: false,
        itemId: { type: ObjectId, ref: "Item" },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalPrice: { type: Number, default: 0 },
    totalItem: { type: Number, default: 0 },
    isBuy: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
