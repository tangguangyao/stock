/*
 * 路由处理
*/
var crypto = require('crypto'), //密码加密模块
    User = require('../models/user.js'), //引入用户登录函数
    login = require('./login'),
    stock = require('./stock'),
    people = require('./people'),
    setting = require('./setting'),
    talk = require('./talk'),
    stockroom = require('./stockroom');

module.exports = function(app){
  app.get('/',function(req,res){
    if(req.session.user){
      res.render('index', { 
        user:req.session.user,
        isStock:true
      });
    }else{
      res.redirect('/login');
    }
  });

  app.get('/login',function(req,res){
    login.islogin(req,res);
  });

  app.get('/loginOut',function(req,res){
    login.loginOut(req,res);
  });

  app.get('/people/:name',function(req,res){
    people.show(req,res);
  });

  app.get('/setting',function(req,res){
    setting.show(req,res);
  });

  app.get('/stock/:uid',function(req,res){
    stock.show(req,res);
  });

  app.post('/sign',function(req,res){
    //在post请求后的反应
    login.sign(req,res);
  });
  app.post('/login',function(req,res){
    //在post请求后的反应
    login.login(req,res);
  });
  app.post('/loginAjax',function(req,res){
    login.loginAjax(req,res);
  });
  
  app.get('/watchStock',function(req,res){
    stock.watch(req,res);
  });

  app.get('/stockAboutName',function(req,res){
    stock.aboutName(req,res);
  });

  app.get('/hotStock',function(req,res){
    stock.hotStock(req,res);
  });

  app.get('/watchPeople',function(req,res){
    people.watchPeople(req,res);
  });

  app.get('/unwatchPeople',function(req,res){
    people.unwatchPeople(req,res);
  });

  app.get('/peopleWatchTab',function(req,res){
    people.watchTab(req,res);
  });

  app.get('/peopleFensTab',function(req,res){
    people.fensTab(req,res);
  });

  app.get('/hotPeople',function(req,res){
    people.hotPeople(req,res);
  });

  app.post('/setting',function(req,res){
    setting.post(req,res);
  });

  app.post('/setPassword',function(req,res){
    setting.setPassword(req,res);
  });

  app.get('/talkHistory',function(req,res){
    stockroom.talkHistory(req,res);
  });

  //提交话题
  app.post('/submitTopic',function(req,res){
    talk.submitTopic(req,res);
  });

  //获取我的话题
  app.get('/myTopic',function(req,res){
    talk.myTopic(req,res);
  });
};
