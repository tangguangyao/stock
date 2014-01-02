var assert = require("assert");
var should = require('should');

var request = require('supertest');
var app = require('../../app');

var http;
var cookie;
describe('login rount', function(){

  // var key = new Date().getTime() + '_' + Math.random();
  // var name="test"+key;
  // var user=new User({name:name,password:1,admin:100});
  // var name2="test"
  // var user2=new User({name:name2,password:1,admin:100});

	//先创建测试用户
	before(function (done) {
    request(app).post('/loginAjax').send({name:"tang",password:"1234"}).end(function(err,res){
        //res.should.have.status(200);
        cookie = res.headers['set-cookie'];
        done();        
      });
	});
	//删除测试股票
	after(function () {
    //app.close();
  });

  describe('login get /', function(){    
    it('user is login', function (done) {
      request(app).get('/').set('cookie', cookie).expect(200,function(err,res){
        if(err) {
          if(res.status==302){
            should.not.exist(res.header.location);
            //res.body.isOk.should.equal(true);
            done();
          }else{
            done(err);
          }
        } else {
          should.not.exist(res.header.location);
          //res.body.isOk.should.equal(true);
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