var express = require('express');
var router = express.Router();
var pug = require('pug');
var htmlToPdf = require('html-to-pdf');
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
    var html = fn({title: 'Report', orders: orders});

    console.log("filepath", filePath);
    console.log("pdf", path.join(__dirname, 'report.pdf'));
    
    htmlToPdf.convertHTMLString(html, path.join(__dirname, 'report.pdf'),
    function (error, success) {
        if (error) {
          res.render('error', { error: error });
        } else {
          res.download(__dirname+'/report.pdf');
        }
      });
    }).catch((err) => {
      res.render('error', { error: err });
  });
});

module.exports = router;