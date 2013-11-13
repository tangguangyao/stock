/*
 * GET home page.
 */
var crypto = require('crypto'), //密码加密模块
    User = require('../models/user.js'), //引入用户登录函数
    login= require('./login');

module.exports = function(app){
  app.get('/',function(req,res){
    res.render('index', { title: 'Express' });
  });

  app.get('/login',function(req,res){
    login.islogin(req,res);
  });

  app.get('/loginOut',function(req,res){
    login.loginOut(req,res);
  });

  app.get('/people',function(req,res){
    res.render('people', { title: 'Express' });
  });

  app.get('/setting',function(req,res){
    res.render('setting', { title: 'Express' });
  });

  app.get('/stock',function(req,res){
    res.render('stock', { title: 'Express' });
  });


  app.post('/sign',function(req,res){
   //在post请求后的反应
   login.sign(req,res);
  });
  app.post('/login',function(req,res){
   //在post请求后的反应
   login.login(req,res);
  });
};
