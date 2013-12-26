var assert = require("assert");
var should = require('should');

// var talk= require('../../routes/talk');
var User = require('../../models/user');

var mongodb = require('../../models/db');
var connect=require('../../models/connect');

describe('models user', function(){
	
	//先创建测试用户
	before(function () {
    //留下50毫秒等待连接上数据库，存在一个全局变量global.db
    // setTimeout(function () {
  		// user.save(function (err, _user) {});
  		// user2.save(function (err, _user) {});
    // },50);
	});
	//删除测试用户
	after(function () {
    // global.db.collection('user',function(err,collection){
    // 	collection.remove({admin:100},function(err){});
    // });
  });

  describe('a suite of tests', function(){
    this.timeout(500);

    it('should take less than 500ms', function(done){
      setTimeout(done, 300);
    })

    it('should take less than 500ms as well', function(done){
      setTimeout(done, 200);
    })
  })


	//读取用户信息
	// describe('User.get', function(){
 //  	it('get name', function (done) {
 //      User.get("tang", function (err,user) {
 //        should.not.exist(err);
 //        user.name.should.equal("tang");
 //        user.admin.should.equal(3);
 //        done();
 //      });
 //    });

 //    it('get name', function (done) {
 //      User.get("tang", function (err,user) {
 //        should.not.exist(err);
 //        user.name.should.equal("tang");
 //        user.admin.should.equal(3);
 //        done();
 //      });
 //      // Number(1).should.be.equal(2);
 //      // done();
 //    });

 //    it('get name', function (done) {
 //      User.get("tang", function (err,user) {
 //        should.not.exist(err);
 //        user.name.should.equal("tang");
 //        user.admin.should.equal(3);
 //        done();
 //      });
 //    });

 //  })

})

