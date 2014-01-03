var assert = require("assert");
var should = require('should');

var request = require('supertest');
var app = require('../../app');

var http;
describe('nologin rount', function(){
	//先创建测试用户
	before(function () {
    app.listen(0);
    http=request(app);
	});
	//删除测试股票
	after(function () {
    //app.close();
    //删除测试用户
    global.db.collection('user',function(err,collection){
      collection.remove({name:"testuser"},function(err){});
    });
  });

	//访问首页
	describe('get /', function(){
  	it('get / 200 or 302', function (done) {
      http.get('/').expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            res.headers.location.should.equal("/login");
            done();
          }else{
            done(err);
          }
        } else {
          res.headers.location.should.equal("/login");
          done();
        }
      })
    });
  });

  //访问登录页
  describe('get /login', function(){
    it('get /login 200 or 302', function (done) {
      http.get('/login').expect(200,function(err,res){
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

  //访问用户页面
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

  //访问设置页面
  describe('get /setting', function(){
    it('get /setting', function (done) {
      http.get('/setting').expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            res.header.location.should.equal("/login");
            done();
          }else{
            done(err);
          }
        } else {
          res.header.location.should.equal("/login");
          done();
        }
      })
    });
  });

  //访问股票页面
  describe('get /stock/:uid', function(){
    it('get /stock/sh600171', function (done) {
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

  //注册测试用户
  describe('post /sign', function(){
    it('post /sign password_re is err', function (done) {
      http.post('/sign').send({name:"tang",password:"1",repassword:"2"}).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            res.header.location.should.equal("/login");
            done();
          }else{
            done(err);
          }
        } else {
          res.header.location.should.equal("/login");
          done();
        }
      })
    });

    it('post /sign user is exist', function (done) {
      http.post('/sign').send({name:"tang",password:"1",repassword:"1"}).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            res.header.location.should.equal("/login");
            done();
          }else{
            done(err);
          }
        } else {
          res.header.location.should.equal("/login");
          done();
        }
      })
    });

    it('post /sign user is ok', function (done) {
      http.post('/sign').send({name:"testuser",password:"1",repassword:"1"}).expect(200,function(err,res){
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

  //访问post登录页面
  describe('post login', function(){
    it('login right user / 200 or 302', function (done) {
      http.post('/login').send({name:"testuser",password:"1"}).expect(200,function(err,res){
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
      http.post('/login').send({name:"testuser",password:"123"}).expect(200,function(err,res){
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
  
  //异步登录测试
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
      http.post('/loginAjax').send({name:"testuser",password:"1"}).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            res.body.ok.should.equal(true);
            res.body.info.name.should.equal("testuser");
            done();
          }else{
            done(err);
          }
        } else {
          res.body.ok.should.equal(true);
          res.body.info.name.should.equal("testuser");
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
