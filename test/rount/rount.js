var assert = require("assert");
var should = require('should');

var request = require('supertest');
var app = require('../../app');

var http;
describe('models user', function(){
	//先创建测试用户
	before(function () {
    app.listen(0);
    http=request(app);
	});
	//删除测试股票
	after(function () {
    //app.close();
  });

	//访问首页
	describe('rount', function(){
  	it('get / 200 or 302', function (done) {
      http.get('/').expect(200,function(err,res){
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

  //访问post登录页面
  describe('post login', function(){
    it('login right user / 200 or 302', function (done) {
      http.post('/login').send({name:"tang",password:"1234"}).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            res.header.location.should.equal("/");
            done();
          }else{
            done(err);
          }
        } else {
          done();
        }
      })
    });

    it('login err password / 200 or 302', function (done) {
      http.post('/login').send({name:"tang",password:"12345"}).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            res.header.location.should.equal("/login");
            done();
          }else{
            done(err);
          }
        } else {
          done();
        }
      })
    });

    it('login not user / 200 or 302', function (done) {
      http.post('/login').send({name:"tang111",password:"12345"}).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            res.header.location.should.equal("/login");
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

  //ajax loginOut 登出
  describe('ajax get loginOut', function(){
    it('loginOut / 200 or 302', function (done) {
      http.get('/loginOut').expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            //data.ok=true;
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
  
  describe('get /people/:name', function(){
    it('get /people/tang', function (done) {
      http.get('/people/tang').expect(200,function(err,res){
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

  describe('get /setting', function(){
    it('get /setting', function (done) {
      http.get('/setting').expect(200,function(err,res){
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

  describe('get /stock/:uid', function(){
    it('get /setting', function (done) {
      http.get('/stock/sh600171').expect(200,function(err,res){
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

  describe('ajax post /loginAjax', function(){
    it('ajax err user', function (done) {
      http.post('/loginAjax').send({name:"tang111",password:"1234"}).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            res.body.ok.should.equal(false);
            res.body.message.should.equal("用户名或密码错误");
            done();
          }else{
            done(err);
          }
        } else {
          res.body.ok.should.equal(false);
          res.body.message.should.equal("用户名或密码错误");
          done();
        }
      })
    });

    it('ajax err password', function (done) {
      http.post('/loginAjax').send({name:"tang",password:"1234567"}).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            res.body.ok.should.equal(false);
            res.body.message.should.equal("用户名或密码错误");
            done();
          }else{
            done(err);
          }
        } else {
          res.body.ok.should.equal(false);
          res.body.message.should.equal("用户名或密码错误");
          done();
        }
      })
    });

    it('ajax right ok', function (done) {
      http.post('/loginAjax').send({name:"tang",password:"1234"}).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            res.body.ok.should.equal(true);
            res.body.info.name.should.equal("tang");
            done();
          }else{
            done(err);
          }
        } else {
          res.body.ok.should.equal(true);
          res.body.info.name.should.equal("tang");
          done();
        }
      })
    });

  });

  // describe('ajax post /submitTopic', function(){
  //   it('post submitTopic', function (done) {
  //     var commentObj={
  //       aboutPeople: ['yao'],
  //       aboutStockName: ['上海贝岭'],
  //       aboutStockcode: ['sh600171'],
  //       name: "tang",
  //       topic: "asdasd$上海贝岭$,$sh600171$, @guang !"
  //     }

  //     http.post('/submitTopic').send(commentObj).expect(200,function(err,res){
  //       if(err) {
  //         if(res.status==302){
  //           //res.body.isOk.should.equal(true);
  //           done();
  //         }else{
  //           done(err);
  //         }
  //       } else {
  //         //res.body.isOk.should.equal(true);
  //         done();
  //       }
  //     })
  //   });
  // });  

  describe('ajax get /aboutStockTopic', function(){
    it('get aboutStockTopic', function (done) {
      http.get('/aboutStockTopic/?name=tang&pageNum=0&pageSize=10').expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            res.body.isOk.should.equal(true);
            done();
          }else{
            done(err);
          }
        } else {
          res.body.isOk.should.equal(true);
          done();
        }
      })
    });
  });

})
