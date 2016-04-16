/*
* 生成一个路由实例用来捕获访问主页的GET请求，导出这个路由并在app.js
* 中通过app.use('/',routes);加载。这样，当访问主页时，
* 就会调用res.render('index',{title:'Express'});
* 渲染views/index.ejx模板并显示到浏览器中
* */



var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//
// module.exports = router;
module.exports = function (app) {
  app.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
};