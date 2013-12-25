var assert = require("assert");
var should = require('should');
var app = require('../../app');

var talk= require('../../routes/talk');
var topic = require('../../models/topic');

var User = require('../../models/user');

describe('models topic', function(){

  var key = new Date().getTime() + '_' + Math.random();
  var name="test"+key;
  var user=new User({name:name,password:1,admin:100});

  var name2="topictest";
  var user2=new User({name:name2,password:1,admin:100});

  var teststockcode="sh999999";
  var teststockname="测试股票";

  var testUid;
  var testPid;
  //先创建测试用户,
  before(function () {
    user.save(function (err, _user) {});
    user2.save(function (err, _user) {});
  });
  //删除测试用户
  after(function () {
    global.db.collection('user',function(err,collection){
      collection.remove({admin:100},function(err){});
    });
    global.db.collection('topic',function(err,collection){
      collection.remove({test:true},function(err){});
    });
    global.db.collection('comment',function(err,collection){
      collection.remove({test:true},function(err){});
    });
  });

  //添加新话题
  describe('topic.addTopic : add a topic', function(){
    it('add ok', function (done) {
      var obj={
        aboutPeople: [name,name2],
        aboutStockName: [teststockname],
        aboutStockcode: [teststockcode],
        comment: 0,
        forward: 0,
        hide: false,
        isForward: false,
        name: name,
        time: "2013-12-25 13:51",
        topic: "测试...@"+name+" asdad@"+name2+" sad$"+teststockcode+"$",
        test:true
      }
      topic.addTopic(obj,function(data){
        data.isOk.should.equal(true);
        //检查新加的是否成功
        data.data[0].test.should.equal(true);
        testUid=testPid=data.data[0].uid
        done();
      });
    });
  });

  //获取用户话题
  describe('topic.myTopic : get topic of user', function(){
    it('get topic ok', function (done) { 
      topic.myTopic(name,10,0, function (items) {
        items.isOk.should.equal(true);
        items.data.length.should.equal(1);
        done();
      });
    });

    it('get topic name is err', function (done) { 
      topic.myTopic(name+"1212",10,0, function (items) {
        items.isOk.should.equal(true);
        items.data.length.should.equal(0);
        done();
      });
    });
  });

  //用户关注的对象的话题
  describe('topic.aboutTopic : get topic of user watch people', function(){
    it('user not watch people ok', function (done) { 
      topic.aboutTopic(name,10,0, function (items) {
        items.isOk.should.equal(true);
        //没有关注对象，所以没有话题
        items.data.length.should.equal(0);
        done();
      });
    });

    it('user watch people ok', function (done) {
      //先关注一个用户 
      User.watch(true,name,[],name2,function(err,data){
        if(data.ok){
          topic.aboutTopic(name,10,0, function (items) {
            items.isOk.should.equal(true);
            //name2 测试中没有发布话题
            items.data.length.should.equal(0);
            done();
          });
        }
      })
    });
  });

  //用户关注的股票的相关话题--股票的相关话题
  describe('topic.stockTopic : get topic of @stock', function(){
    it('@stock ok', function (done) {
      //假设关注了teststockcode
      topic.stockTopic(teststockcode,teststockname,10,0, function (items) {
        items.isOk.should.equal(true);
        //测试的话题相关了teststockcode
        items.data.length.should.equal(1);
        done();
      });
    });
  });

  //@ 股票的话题
  describe('topic.aboutStockTopic : get topic of user watch stock', function(){
    it('user not watch stock ok', function (done) { 
      topic.aboutStockTopic(name,10,0, function (items) {
        items.isOk.should.equal(true);
        //用户没有关注股票，话题为0
        items.data.length.should.equal(0);
        done();
      });
    });

    it('user watch stock ok', function (done) { 
      //先关注一个测试股票
      User.stockUp({name:name},teststockcode,true,function(err,items){
        if(items===1){
          topic.aboutStockTopic(name,10,0, function (items) {
            items.isOk.should.equal(true);
            //测试的话题相关了teststockcode
            items.data.length.should.equal(1);
            done();
          });
        }
      })
    });
  });

  //@我的话题
  describe('topic.atmeTopic : get topic of @user', function(){
    it('@user ok', function (done) { 
      topic.atmeTopic(name,10,0, function (items) {
        items.isOk.should.equal(true);
        //测试的话题和我相关
        items.data.length.should.equal(1);
        done();
      });
    });
  });

  //添加话题的评论
  describe('topic.addComment : add comment to topic', function(){
    it('add comment and not Forward ok', function (done) { 
      var obj={
        aboutPeople: [],
        aboutStockName: [],
        aboutStockcode: [],
        hide: false,
        name: name,
        pid: testPid,
        time: "2013-12-25 16:1",
        topic: "测试1",
        test:true
      };
      topic.addComment(false,obj, function (items) {
        items.isOk.should.equal(true);
        items.add.should.equal("comment");
        done();
      });
    });

    it('add comment and Forward ok', function (done) { 
      var obj={
        aboutPeople: [],
        aboutStockName: [],
        aboutStockcode: [],
        hide: false,
        name: name,
        pid: testPid,
        time: "2013-12-25 16:1",
        topic: "测试2",
        test:true
      };
      topic.addComment(true,obj, function (items) {
        items.isOk.should.equal(true);
        items.add.should.equal("commentAndForward");
        done();
      });
    });
  });

  //获取话题的评论
  describe('topic.getComment : get comment to topic', function(){
    it('get comment ok', function (done) { 
      topic.getComment(testUid,10,0, function (items) {
        items.isOk.should.equal(true);
        //测试topic.addComment接口时添加的两个评论
        items.data.length.should.equal(2);
        done();
      });
    });
  });

})