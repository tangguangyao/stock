var assert = require("assert");
var should = require('should');
var app = require('../../app');

var talk= require('../../routes/talk');
var topic = require('../../models/topic');


describe('models topic', function(){
	//获取话题的评论
  describe('topic.getComment', function(){
  	it('test uid 48 ok', function (done) {
  		setTimeout(function () {
	      topic.getComment(48,10,0, function (items) {
	        items.isOk.should.equal(true);
	        done();
	      });
	    },100);
    });

    it('test null should empty', function (done) {
      topic.getComment(null,10,0, function (items) {
        items.isOk.should.equal(true);
        items.data.length.should.equal(0);
        done();
      });
    });
  })

  //添加评论
  // describe('topic.addComment', function(){
  //   it('addComment ok', function (done) {
  //     topic.addComment(true,null, function (items) {
  //       items.isOk.should.equal(true);
  //       done();
  //     });
  //   });

  //   // it('addComment empty', function (done) {
  //   //   topic.addComment(null,10,0, function (items) {
  //   //     items.isOk.should.equal(true);
  //   //     items.data.length.should.equal(0);
  //   //     done();
  //   //   });
  //   // });
  // })





  //获取@ 我的评论
  describe('topic.atmeTopic', function(){
  	it('should ok', function (done) {
      topic.atmeTopic('tang',10,0, function (items) {
        items.isOk.should.equal(true);
        done();
      });
    });

    it('should empty', function (done) {
      topic.atmeTopic(null,10,0, function (items) {
        items.isOk.should.equal(true);
        done();
      });
    });
  })

  //和股票相关的话题
  describe('topic.aboutStockTopic', function(){
  	it('aboutStockTopic should ok', function (done) {
      topic.aboutStockTopic('tang',10,0, function (items) {
        items.isOk.should.equal(true);
        done();
      });
    });

    it('aboutStockTopic should empty', function (done) {
      topic.aboutStockTopic(null,10,0, function (items) {
        items.isOk.should.equal(true);
        done();
      });
    });
  })
})