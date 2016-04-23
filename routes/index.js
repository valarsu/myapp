/*
* 生成一个路由实例用来捕获访问主页的GET请求，导出这个路由并在app.js
* 中通过app.use('/',routes);加载。这样，当访问主页时，
* 就会调用res.render('index',{title:'Express'});
* 渲染views/index.ejx模板并显示到浏览器中
* */



var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
    User = require('../models/user.js');
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//
// module.exports = router;
module.exports = function (app) {
    app.get('/', function(req, res, next) {
        res.render('index', { title: '主页' });
    });
    app.get('/reg', function(req, res, next) {
        res.render('reg', { title: '注册' });
    });
    app.post('/reg',function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];
        if(password_re !== password){
            req.flash('error','两次输入的密码不一致！');
            return res.redirect('/reg');//返回注册页
        }
        //生成密码的md5值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: name,
            password: password,
            email: req.body.email
        });
        //检查用户名是否已经存在
        User.get(newUser.name,function (err, user) {
            if(err){
                req.flash('error', err);
                return res.redirect('/reg');
            }
            if(user){
                req.flash('error', '用户已存在！');
                return res.redirect('/reg');//返回注册页
            }
            //如果不存在就新增用户
            newUser.save(function (err, user) {
                if(err){
                    req.flash('error',err);
                    return res.redirect('/reg');//注册失败返回注册页
                }
                req.session.user= newUser;//用户信息存入session
                req.flash('success','注册成功！');
                res.redirect('/');//注册成功返回主页
            });
        });
    });
    app.get('/login', function(req, res, next) {
        res.render('login', { title: '登录' });
    });
    app.post('/login',function (req, res) {
    });
    app.get('/post', function(req, res, next) {
        res.render('post', { title: '发表文章' });
    });
    app.post('/post',function (req, res) {
    });
    app.get('/logout', function(req, res, next) {
    });
};

