var assert = require("assert");
var should = require('should');
var app = require('../app');


var talk= require('../routes/talk');
var topic = require('../models/topic');


var mongodb = require('../models/db');



describe('talk', function(){
  describe('topic.getComment', function(){
  	before(function () {
				// mongodb.open(function(err,db){
				// 	global.db=db;
				// });
	  });

  	it('should empty', function (done) {
  		setTimeout(function () {
	      topic.getComment(48,10,0, function (items) {
	        items.isOk.should.equal(true);
	        done();
	      });
	    },6000);
    });


  })
})