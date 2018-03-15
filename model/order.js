const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const orderSchema = new Schema({
  name: { type: String, index: true},
  quantity: Number,
  createdTillNow: Number,
  predicted: Number,
  status: Boolean
}, { timestamps: true });

orderSchema.methods.toJSON = function() {
  let obj = this.toObject();
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
 }

const Order = mongoose.model('Order', orderSchema, "orders");

module.exports = Order;