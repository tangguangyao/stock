var assert = require("assert");
var should = require('should');

var request = require('supertest');
var app = require('../../app');


describe('models user', function(){
	//先创建测试用户
	before(function () {
    app.listen(0);
	});
	//删除测试股票
	after(function () {
    //app.close();
  });

	//关注，取消关注 股票
	describe('rount', function(){
  	it('get /', function (done) {
      request(app).get('/').end(function(err, res){
        if (err) return done(err);
        done()
      });
    });
  });
  
})
