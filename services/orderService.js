const Order = require('../model/order');

module.exports = {

  createOrder: (order) => {
    return order.save();
  },

  findAllOrder:  () => {
    return Order.find({});
  },

  findOrderById: (id) => {
    return Order.findById(id);
  },

  findOrderByName:  (name) => {
    return Order.findOne({'name': name });
  },

  updateOrder : (order) => {
    return order.save();
  }  
}