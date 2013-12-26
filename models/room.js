/*
数据库聊天室内容存入和读取
*/

var mongodb = require('./db');
var connect=require('./connect');

var room={};

module.exports = room;

room.stockRoom=function(stock,callback){
	//关闭页面是也会触发，所以当聊天记录为0时，不用存入数据库
	if(stock.text.length > 0){
		global.db.collection('room',function(err,collection){
			//每次以传入新增一个记录
			var room = { 
				uid : stock.stock,
				history : stock.text
			};
			collection.insert(room,{safe: true},function(err,stocItem){
				if(err) throw err;
				callback(err);
			});
		});
	}
};

room.talkHistory=function(uid,count,callback){
	global.db.collection('room',function(err,collection){
		collection.find({uid:uid}).sort({_id: -1}).skip(count).limit(1).toArray(function(err,items){
			callback(items);
		});
	});
};