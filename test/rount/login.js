var assert = require("assert");
var should = require('should');

var request = require('supertest');
var app = require('../../app');
var Stoc = require('../../models/stoc');

var http;
var cookie;
describe('login rount', function(){

  // var key = new Date().getTime() + '_' + Math.random();
  // var name="test"+key;
  // var user=new User({name:name,password:1,admin:100});
  // var name2="test"
  // var user2=new User({name:name2,password:1,admin:100});

  var teststock=new Stoc({
    beWatch:{
      name: "testname",
      top: "2"
    },
    name: "测试股票",
    uid: "sh999999",
    top: "1"
  });

	//先创建测试用户
	before(function (done) {    
    // request(app).post('/loginAjax').send({name:"testuser",password:"1"}).end(function(err,res){
    //   //res.should.have.status(200);
    //   cookie = res.headers['set-cookie'];
    //   done();        
    // });

    //创建一个测试股票
    //teststock.watch(function (user) {});
    //创建一个测试用户，并且保存cookie
    request(app).post('/sign').send({name:"testuser",password:"1",repassword:"1"}).expect(200,function(err,res){
      cookie = res.headers['set-cookie'];
      done(); 
    });
	});
	//删除测试股票
	after(function () {
    //app.close();
    //删除测试用户
    global.db.collection('user',function(err,collection){
      collection.remove({name:"testuser"},function(err){});
    });
    //删除测试股票
    global.db.collection('sto',function(err,collection){
      collection.remove({uid:'sh999999'},function(err){});
    });
  });

  //测试访问首页
  describe('login get /', function(){    
    it('user is login', function (done) {
      request(app).get('/').set('cookie', cookie).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            should.not.exist(res.header.location);
            done();
          }else{
            done(err);
          }
        } else {
          should.not.exist(res.header.location);
          done();
        }
      })
    })
  });

  //访问登录页
  describe('login get /login', function(){
    it('get /login 200 or 302', function (done) {
      request(app).get('/login').set('cookie', cookie).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            res.header.location.should.equal("/");
            done();
          }else{
            done(err);
          }
        } else {
          res.header.location.should.equal("/");
          done();
        }
      })
    });
  });

  //登录用户访问用户页面
  describe('get /people/:name', function(){
    it('get /people/tang self', function (done) {
      request(app).get('/people/tang').set('cookie', cookie).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            done();
          }else{
            done(err);
          }
        } else {
          done();
        }
      })
    });

    it('get /people/tang not self', function (done) {
      request(app).get('/people/guang').set('cookie', cookie).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            done();
          }else{
            done(err);
          }
        } else {
          done();
        }
      })
    });
  });

  //访问设置页面
  describe('get /setting', function(){
    it('get /setting', function (done) {
      request(app).get('/setting').set('cookie', cookie).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            should.not.exist(res.header.location);
            done();
          }else{
            done(err);
          }
        } else {
          should.not.exist(res.header.location);
          done();
        }
      })
    });
  });

  //关注股票
  describe('get /watchStock', function(){
    //关注股票并且新建股票
    it('watch stock and creat stock', function (done) {
      request(app).get('/watchStock?uid=sh999999&name=测试股票&beWatchName=testuser&beWatchTop=1&add=1').set('cookie', cookie).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            res.body.ok.should.equal(true);
            done();
          }else{
            done(err);
          }
        } else {
          res.body.ok.should.equal(true);
          done();
        }
      })
    });
  });






  //ajax loginOut 登出
  //登出会清空req.session.user
  describe('ajax get loginOut', function(){
    it('loginOut / 200 or 302', function (done) {
      request(app).get('/loginOut').set('cookie', cookie).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            res.body.ok.should.equal(true);
            done();
          }else{
            done(err);
          }
        } else {
          res.body.ok.should.equal(true);
          done();
        }
      })
    });
  });

  //用户登陆后评价
  // describe('ajax post /submitTopic', function(){
  //   it('post submitTopic', function (done) {
  //     var commentObj={
  //       aboutPeople: ['yao'],
  //       aboutStockName: ['上海贝岭'],
  //       aboutStockcode: ['sh600171'],
  //       name: "tang",
  //       topic: "111111$上海贝岭$,$sh600171$, @guang !"
  //     }

  //     request(app).post('/submitTopic').send(commentObj).set('cookie', cookie).expect(200,function(err,res){
  //       if(err) {
  //         if(res.status==302){
  //           res.body.isOk.should.equal(true);
  //           done();
  //         }else{
  //           done(err);
  //         }
  //       } else {
  //         res.body.isOk.should.equal(true);
  //         done();
  //       }
  //     })
  //   });
  // });
})