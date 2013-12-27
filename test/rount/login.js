var assert = require("assert");
var should = require('should');

var request = require('supertest');
var app = require('../../app');

var http;
var cookie;
describe('models user', function(){
	//先创建测试用户
	before(function () {
	});
	//删除测试股票
	after(function () {
    //app.close();
  });

	//用户登陆后评价
  describe('ajax post /submitTopic', function(){
    it('login', function (done){
      request(app).post('/loginAjax').send({name:"tang",password:"1234"}).end(function(err,res){
        //res.should.have.status(200);
        cookie = res.headers['set-cookie'];
        done();        
      });
    });

    it('post submitTopic', function (done) {
      var commentObj={
        aboutPeople: ['yao'],
        aboutStockName: ['上海贝岭'],
        aboutStockcode: ['sh600171'],
        name: "tang",
        topic: "asdasd$上海贝岭$,$sh600171$, @guang !"
      }

      request(app).post('/submitTopic').send(commentObj).set('cookie', cookie).expect(200,function(err,res){
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

  describe('login get /', function(){
    it('login', function (done){
      request(app).post('/loginAjax').send({name:"tang",password:"1234"}).end(function(err,res){
        //res.should.have.status(200);
        cookie = res.headers['set-cookie'];
        done();        
      });
    });
    
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
})