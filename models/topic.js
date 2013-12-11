/*
评论数据库
*/
var mongodb = require('./db');
var connect=require('./connect');

var topic={};

module.exports = topic;

topic.addTopic=function(obj,callback){
	global.db.collection('topic',function(err,collection){
		//增加一个自增uid
		collection.find().sort({_id: -1}).limit(1).toArray(function(err,items){
			if(items.length>0){
				obj.uid=items[0].uid+1;
				collection.insert(obj,{safe: true},function(err,topicItem){
					if(err){
						callback({isOk:false});
					}else{
						callback({isOk:true});
					}
				});
			}else{
				obj.uid=0;
				collection.insert(obj,{safe: true},function(err,topicItem){
					if(err){
						callback({isOk:false});
					}else{
						callback({isOk:true});
					}
				});
			}	
		});
    });
}

topic.myTopic=function(name,size,num,callback){
	global.db.collection('topic',function(err,collection){
		collection.find({name:name,hide:false}).sort({_id: -1}).skip(num).limit(size).toArray(function(err,items){
			if(err){
				callback({isOk:false});
			}else{
				callback({isOk:true,data:items});
			}
		});
	});
}