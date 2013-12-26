var assert = require("assert");
var should = require('should');

var room = require('../../models/room');

var mongodb = require('../../models/db');
var connect=require('../../models/connect');

describe('models user', function(){
	//先创建测试用户
	before(function () {

	});
	//删除测试股票
	after(function () {
    global.db.collection('room',function(err,collection){
    	collection.remove({uid:'sh999999'},function(err){});
    });
  });

	//关注，取消关注 股票
	describe('Stoc.prototype.watch', function(){
  	it('watch add and creat stock', function (done) {
      var stock={
        stock: "sh999999",
        stockName: "测试股票",
        text: [{name: "testname",text: "dfgdgdf ",time: "2013-12-26 16:21:36"}],
        user: ["testname"]
      }
      room.stockRoom(stock,function (err) {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('room.talkHistory', function(){
    it('get talkHistory', function (done) {
      room.talkHistory('sh999999',0,function(items){
        //测试保存一条数据
        items.length.should.equal(1);
        done();
      });
    });
  });
  
})

