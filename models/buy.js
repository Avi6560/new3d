const mongoose = require('mongoose');
const ObjectId=  mongoose.Schema.Types.ObjectId;
// Define a schema for storing payment details
const paymentSchema = new mongoose.Schema({
  orderId: {type:String},
  paymentId: {type :String},
  signature: {type :String},
  amount: Number,
  currency: String,
  user: {
    type: ObjectId,
    ref: 'User',
  },
});

// Create a model for the payment details
const Payment = mongoose.model('Payment', paymentSchema);

// Save the payment details to the database
async function savePaymentDetails(orderId, paymentId, signature, amount, currency, userId) {
  const payment = new Payment({
    orderId,
    paymentId,
    signature,
    amount,
    currency,
    user: userId,
  });

  try {
    await payment.save();
    console.log('Payment details saved successfully');
  } catch (error) {
    console.error(error);
    throw new Error('Failed to save payment details');
  }
}

module.exports = {
  savePaymentDetails,
};
