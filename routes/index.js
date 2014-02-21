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
    stockroom = require('./stockroom'),
    test = require('./test'),
    async = require('async');

module.exports = function(app){
  app.get('/',function(req,res){
    if(req.session.user){
      //原始方式
      // res.render('index', { 
      //   user:req.session.user,
      //   isStock:true
      // });

      //pipe替换    
      res.render('index', {
        user:req.session.user,
        isStock:true
      },function (err, str) {
        //res.setHeader('content-type', 'text/html; charset=utf-8')
        res.write(str);
      })
      //bigpipe获取hotStock接口数据
      async.parallel([
        function(cb) {
          stock.bigpipeHotStock(function(data){
            res.write('<script>bigpipe.set("hotStock",'+JSON.stringify(data)+');</script>');
            cb(null);
          })
        },
        function(cb) {
          people.bigpipeHotPeople(req,res,function(data){
            res.write('<script>bigpipe.set("hotPeople",'+JSON.stringify(data)+');</script>');
            cb(null);
          })
        }
      ], function (err, results) {
        res.end();
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

  //提交评论
  app.post('/submitCommentTopic',function(req,res){
    talk.submitCommentTopic(req,res);
  });

  //获取话题评论
  app.get('/getComment',function(req,res){
    talk.getComment(req,res);
  });

  //获取相关话题
  app.get('/aboutTopic',function(req,res){
    talk.aboutTopic(req,res);
  });

  app.get('/stockTopic',function(req,res){
    talk.stockTopic(req,res);
  });

  //获取用户关注的股票的话题
  app.get('/aboutStockTopic',function(req,res){
    talk.aboutStockTopic(req,res);
  });
  //获取@我的话题
  app.get('/atmeTopic',function(req,res){
    talk.atmeTopic(req,res);
  });

  app.get('/test',function(req,res){
    test.redis(req,res);
  });

  /*
  *重构angularjs新增app接口
  */
  app.get('/isOnline',function(req,res){
    login.isOnline(req,res);
  });

  app.get('/peopleAjax',function(req,res){
    people.showAjax(req,res);
  });

  app.get('/stockAjax/:uid',function(req,res){
    stock.showAjax(req,res);
  });

  app.get('/settingAjax',function(req,res){
    setting.showAjax(req,res);
  });

  app.post('/setPasswordAjax',function(req,res){
    setting.setPasswordAjax(req,res);
  });


  app.post('/settingAjax',function(req,res){
    setting.postAjax(req,res);
  });
};
