const express = require('express');
const router = express.Router();
const Order = require('../model/order');
const orderService = require('../services/orderService');
const io = require('../services/socketService');

router.post("/", (req, res) => {
    if (!req.body && (!req.body.name || !req.body.quantity)) {
        return res.status(400).send({ message: "Order can not be empty" });
    }

    orderService.findOrderByName(req.body.name).then((previousOrder) => {
        let order;
        if (previousOrder) {
            order = previousOrder;
            order.quantity = previousOrder.quantity + req.body.quantity;
            order.status = false;
        } else {
            order = new Order(req.body);
            order.createdTillNow = 0;
            order.predicted = 0;
            order.status = false;
        }
        return orderService.createOrder(order);
    }).then((data) => {
        io.emit('update kitchen display', data);
        res.json(data);
    });
});

router.get("/", (req, res) => {
    orderService.findAllOrder().then((data) => {
        res.json(data);
    });
});

router.put("/predicted", (req, res) => {
    if (!req.body && (!req.body.name || !req.body.predicted))
        res.status(400).send({ message: "Request can not be empty" });

    orderService.findOrderByName(req.body.name).then((order) => {
        if (!order)
            res.status(404).send({ message: "Order not found with name " + req.body.name });

        let orderSchema = new Order(order);
        orderSchema.predicted = req.body.predicted;
        return orderService.updateOrder(orderSchema);
    }).then((order) => {
        io.emit('predicted updated', order);
        res.json(order);
    }).catch((err) => {
        return res.status(500).send({ message: "Error finding order with name " + req.body.name });
    })
});

router.put("/status", (req, res) => {
    if (!req.body && (!req.body._id || !req.body.status))
        res.status(400).send({ message: "Request can not be empty" });

    orderService.findOrderById(req.body._id).then((order) => {
        if (!order)
            res.status(404).send({ message: "Order not found " });

        order.createdTillNow = order.createdTillNow + order.quantity;
        order.quantity = 0;
        order.status = req.body.status;
        let orderSchema = new Order(order);
        return orderService.updateOrder(orderSchema);
    }).then((order) => {
        io.emit('status done', order);
        res.json(order);
    }).catch((err) => {
        return res.status(500).send({ message: "Error finding order with name " + req.body.name });
    })
});

module.exports = router;