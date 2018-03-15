var express = require('express');
var router = express.Router();
var pug = require('pug');
var htmlToPdf = require('html-pdf');
var path = require('path');

var orderService = require('../services/orderService');

/* GET home page. */
router.get('/', function (req, res, next) {
  orderService.findAllOrder().then((orders) => {
    res.render('index', { title: 'Dalviroo', orders: JSON.parse(JSON.stringify(orders)) });
  }).catch((err) => {
    res.render('error', { error: err });
  });
});

router.get('/report', function (req, res, next) {
  orderService.findAllOrder().then((orders) => {
    res.render('report', { title: 'Report', orders: JSON.parse(JSON.stringify(orders)) });
  }).catch((err) => {
    res.render('error', { error: err });
  });
});

router.get('/generateReport', function (req, res, next) {
  orderService.findAllOrder().then((orders) => {
    var filePath = path.join(__dirname, '..', 'views', 'report.jade');
    var fn = pug.compileFile(filePath);
    var html = fn({ title: 'Report', orders: orders });

    var filename = 'Report-'+ Date().toISOString();
    htmlToPdf.create(html).toBuffer(function (err, buffer) {
      res.writeHead(200,{
        'Content-Type': 'application/pdf',
        'Access-Control-Allow-Origin': '*',
        'Content-Disposition': 'attachment; filename='+filename
      });
      res.write(buffer);
      res.end();
    });
  }).catch((err) => {
    res.render('error', { error: err });
  });
});

module.exports = router;
