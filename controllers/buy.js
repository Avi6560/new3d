const Payment= require('../models/buy')
const User= require('../models/user')
const Item= require('../models/item')
const Cart= require('../models/cart')
const Razorpay= require('razorpay')
const crypto= require('crypto')
const razorpay= new Razorpay({
    key_id: "rzp_test_LXpiejkU0dT6zS",
    key_secret: "dCFnwjwiVIfMiHtoCdsl1TER",
})

const checkout = async (req, res) => {
  const userId = req.body.userId;
  console.log("Checking", userId)
    var options = {
        
      amount: Number(req.body.amount * 100), // amount in the smallest currency unit
      currency: "USD", // currency
    };
    
    const order = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      order,
    });
    const paymentId = order.id.entity; // Extract the payment ID from the order response

    console.log('Payment ID:', paymentId);
  };

  const verifyOrder = async (req, res) => {
    console.log(req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
  
    const body = razorpay_order_id + "|" + razorpay_payment_id;
  
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body.toString())
      .digest("hex");
      console.log("recived",  razorpay_signature);
      console.log("generate",  expectedSignature );
      const isAuthentic = expectedSignature === razorpay_signature;
      if (isAuthentic) {
        // Database comes here
  
        await Payment.create({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        });
        res.redirect(
          `http://localhost:4200/success-payment?reference=${razorpay_payment_id}`
        );
      } else {
        res.status(400).json({success: false});
      }
  };

  module.exports = {checkout, verifyOrder}