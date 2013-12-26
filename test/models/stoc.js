var assert = require("assert");
var should = require('should');

var Stoc = require('../../models/stoc');

var mongodb = require('../../models/db');
var connect=require('../../models/connect');

describe('models user', function(){

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
	before(function () {

	});
	//删除测试股票
	after(function () {
    global.db.collection('sto',function(err,collection){
    	collection.remove({uid:'sh999999'},function(err){});
    });
  });

	//关注，取消关注 股票
	describe('Stoc.prototype.watch', function(){
  	it('watch add and creat stock', function (done) {
      teststock.watch(function (user) {
        user.status.should.equal(200);
        user.uid.should.equal("sh999999");
        done();
      });
    });

    it('user add stock argin', function (done) {
      teststock.watch(function (user) {
        user.status.should.equal(200);
        user.uid.should.equal("sh999999");
        user.message.should.equal("已添加");
        done();
      });
    });

    it('another user add stock', function (done) {
      var teststock2=new Stoc({
        beWatch:{
          name: "testname2",
          top: "3"
        },
        name: "测试股票",
        uid: "sh999999",
        top: "1"
      });
      teststock2.watch(function (user) {
        user.status.should.equal(200);
        user.uid.should.equal("sh999999");
        done();
      });
    });

    it('not add stock', function (done) {
      var teststock2=new Stoc({
        beWatch:{
          name: "testname2",
          top: "3"
        },
        name: "测试股票",
        uid: "sh999999",
        top: "-1"
      });
      teststock2.watch(function (user) {
        user.status.should.equal(200);
        user.uid.should.equal("sh999999");
        done();
      });
    });
  })
  
  //股票相关的用户
  describe('Stoc.aboutName', function(){
    it('stock about name', function (done){
      Stoc.aboutName("sh999999",function(data){
        //添加了2个用户，减少了一个用户，所以剩下一个
        data.beWatch.length.should.equal(1);
        done();
      });
    });
  });

  //热门股票
  describe('Stoc.hotStock', function(){
    it('hotStock', function (done){
      Stoc.hotStock(function(data){
        //添加了2个用户，减少了一个用户，所以剩下一个
        data.length.should.be.above(0);
        done();
      });
    });
  });
})

