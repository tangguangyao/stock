/*
评论两个数据库
话题和评论
*/
var mongodb = require('./db');
var connect=require('./connect');

var topic={};

module.exports = topic;
//话题数据库
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
						callback({isOk:true,data:topicItem});
					}
				});
			}else{
				obj.uid=0;
				collection.insert(obj,{safe: true},function(err,topicItem){
					if(err){
						callback({isOk:false});
					}else{
						callback({isOk:true,data:topicItem});
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


//评论数据库
topic.addComment=function(obj,callback){
	global.db.collection('comment',function(err,collection){
		collection.insert(obj,{safe: true},function(err,topicItem){
			if(!err){
				callback({isOk:true});
				//topic 评论量+1操作
				global.db.collection('topic',function(err,collection){
					var pid=Number(obj.pid);
					collection.update({uid:pid},{$inc:{comment:1}},function(err,items){
						if(!err){
							callback({isOk:true});
						}
					});
				});
			}
		});

		// //增加一个自增uid
		// collection.find().sort({_id: -1}).limit(1).toArray(function(err,items){
		// 	if(items.length>0){
		// 		obj.uid=items[0].uid+1;
		// 		collection.insert(obj,{safe: true},function(err,topicItem){
		// 			if(err){
		// 				callback({isOk:false});
		// 			}else{
		// 				callback({isOk:true});
		// 			}
		// 		});
		// 	}else{
		// 		obj.uid=0;
		// 		collection.insert(obj,{safe: true},function(err,topicItem){
		// 			if(err){
		// 				callback({isOk:false});
		// 			}else{
		// 				callback({isOk:true});
		// 			}
		// 		});
		// 	}	
		// });
    });
}

topic.getComment=function(uid,size,num,callback){
	global.db.collection('comment',function(err,collection){
		collection.find({pid:uid,hide:false}).sort({_id: -1}).skip(num).limit(size).toArray(function(err,items){
			if(err){
				callback({isOk:false});
			}else{
				callback({isOk:true,data:items});
			}
		});
	});
}