const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route   POST /api/payment/order
// @desc    Create Razorpay order
// @access  Private
router.post('/order', protect, async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise for INR)
      currency: 'INR',
      receipt: `receipt_${orderId}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    if (!razorpayOrder) {
      return res.status(500).json({ message: 'Error creating Razorpay order' });
    }

    // Update our order with the razorpayOrderId
    await Order.findByIdAndUpdate(orderId, {
      razorpayOrderId: razorpayOrder.id,
    });

    res.json({
      ...razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment signature
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      db_order_id
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified
      const order = await Order.findById(db_order_id);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.status = 'paid';
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        
        await order.save();
        res.json({ message: "Payment verified successfully" });
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error('Razorpay Verify Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
