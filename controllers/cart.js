const { User } = require("../models/user");
const Item = require("../models/item");
const Cart = require("../models/cart");
const { default: mongoose } = require("mongoose");

const addToCart = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.userId)){
      return res.status(400).send({ status: false, message: "Enter a valid objectId in params" });
    }
    const user = await User.findById(req.params.userId);
    if (!user){
      return res.status(404).send({ status: false, message: "No user found" });
    }
    const productId = req.body.productId;
    if (!mongoose.isValidObjectId(productId)){
      return res.status(400).send({ status: false, message: "Enter a valid productId in body" });
    }
    const product = await Item.findOne({ _id: productId });
    if (!product){
      return res.status(404).send({ status: false, message: "Item not found" });
    }
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (cart) {
      const itemIndex = cart.items.findIndex((el) => el.itemId == productId);

      if (itemIndex > -1) {
        return res.status(400).send({ status: false, message: "Product is already in the cart" });
      }

      cart.items.push({itemId: product._id,quantity: 1,price: product.price});
      cart.totalItem += 1;
      cart.totalPrice += product.price;
      const updatedCart = await cart.save();
      return res.status(201).send({status: true,message: "Product is added to the cart",data: updatedCart});
    }

    const cartDetails = {
      userId: req.params.userId,
      items: [{ itemId: product._id, quantity: 1 }],
      totalItem: 1,
      totalPrice: product.price,
    };

    const newCart = await Cart.create(cartDetails);
    return res.status(201).send({status: true,message: "Cart created successfully",data: newCart});
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const getAllCart = async (req, res) => {
  try {
    const cart = await Cart.find({}).select({ __v: 0 });
    if (!cart) {
      return res.status(400).json({ status: false, message: "Not have any cart" });
    }
    return res.status(200).json({ status: true, message: "Get All Cart ", data: cart });
  } catch (error) {
    console.log(error);
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ status: false, message: "Enter a valid user" });
    }
    const findUser = await Cart.findOne({ userId: userId }).populate("items.itemId");
    if (!findUser) {
      return res.status(404).json({ status: false, message: "please enter a valid user" });
    }
    return res.status(200).json({status: true,message: "Get cart by specific user",data: findUser});
  } catch (error) {
    console.log(error);
  }
};

const removeCartItem = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.userId))
      return res.status(400).send({ status: false, message: "Enter a valid objectId in params" });

    const user = await User.findById(req.params.userId);
    if (!user){
      return res.status(404).send({ status: false, message: "No user found" });
    }
    const productId = req.params.productId;
    if (!mongoose.isValidObjectId(productId))
      return res.status(400).send({ status: false, message: "Enter a valid productId in params" });

    let cartExists = await Cart.findOne({userId: req.params.userId,});
    if (!cartExists)
      return res.status(404).send({ status: false, message: "Cart not found" });

    const itemIndex = cartExists.items.findIndex((el) => el.itemId == productId);
    if (itemIndex === -1)
      return res.status(404).send({status: false,message: "Item not found in the cart or already deleted"});
    const removedItem = cartExists.items.splice(itemIndex, 1)[0];
    let price = await Item.findOne({ _id: removedItem.itemId });
    let itemPrice = price.price;

    let updateCart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $set: {
          items: cartExists.items,
          totalPrice: cartExists.totalPrice - itemPrice,
          totalItem: cartExists.totalItem - 1,
        },
      },
      { new: true }
    );

    let finalCart = await Cart.findOne({ userId: req.params.userId });

    return res.status(200).send({status: true,message: "Item removed from the cart",data: finalCart});
  } catch (error) {
    console.log(error);
  }
};


module.exports = { addToCart, getAllCart, getCartByUserId, removeCartItem };
