/*
评论两个数据库
话题和评论
*/
var mongodb = require('./db');
var connect=require('./connect');
var async = require('async');

//获取是否更新缓存的信息
var redisCache=require('./redisCache');

var topic={};

//缓存
var redis = require("redis"),
    client = redis.createClient();

client.on("error", function(error) {
    console.log(error);
});


module.exports = topic;
//话题数据库

//添加新话题
topic.addTopic=function(obj,callback){
	global.db.collection('topic',function(err,collection){
		//增加一个自增uid，官方有优化，如果有删除操作，会导致bug
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
};

//获取用户的话题
topic.myTopic=function(name,size,num,callback){
	var getFromDB=function(){
		global.db.collection('topic',function(err,collection){
			collection.find({name:name,hide:false}).sort({_id: -1}).skip(num).limit(size).toArray(function(err,items){
				if(err){
					callback({isOk:false});
				}else{
					var json=JSON.stringify(items);
					var key="myTopic"+name;
					client.hmset(key, {isOk:true,data:json},function(error, res){
						if(error) {
              console.log(error);
            } else {
              console.log(res);
            }
					});
					callback({isOk:true,data:items});
				}
			});
		});
	}

	//插入redis判断
	client.hgetall("myTopic"+name, function (err, res) {
	  if(err) {
      console.log(err);
    } else {
    	//首先判断缓存中是否有值，就是用缓存中内容
    	if(res){
    		//然后需要判断下是否有更新
    		var l=redisCache;
    		if(!redisCache.myTopic){//redisCache.myTopic为false表示缓存没有更新
    			if(res.isOk=="true"){
            	var obj={isOk:true,data:JSON.parse(res.data)};
            	callback(obj);
            }
    		}else{
    			getFromDB();
    			redisCache.myTopic=false;//更新缓存后，设置为false
    		}
    	}else{
    		//到数据库中获取最新的值
    		getFromDB();
    		redisCache.myTopic=false;//更新缓存后，设置为false
    	}
        
    }
  });
};

//用户关注对象的话题
topic.aboutTopic=function(name,size,num,callback){
	//先查找这个用户关注对象
	// global.db.collection('user',function(err,collection){
	// 	collection.findOne({name:name},function(err,obj){
	// 		if(!err){
	// 			if(obj.watch.length>0){
	// 				//存在关注用户
	// 				var arr=[];
	// 				obj.watch.forEach(function(k){
	// 					arr.push({name:k});
	// 				});
	// 				//在topic中查找他关注用户的话题
	// 				global.db.collection('topic',function(err,collection){
	// 					collection.find({$or:arr}).sort({_id: -1}).skip(num).limit(size).toArray(function(err,items){
	// 						if(err){
	// 							callback({isOk:false});
	// 						}else{
	// 							callback({isOk:true,data:items});
	// 						}
	// 					});
	// 				});
	// 			}else{
	// 				callback({isOk:true,data:[]});
	// 			}
	// 		}
	// 	});
	// });

	async.waterfall([
    function(cb){
    	//先查找这个用户关注对象
      global.db.collection('user',function(err,collection){
				collection.findOne({name:name},function(err,obj){
					if(!err){
						if(obj.watch.length>0){
							//存在关注用户
							var arr=[];
							obj.watch.forEach(function(k){
								arr.push({name:k});
							});
							cb(null, arr);
						}else{
							callback({isOk:true,data:[]});
						}
					}
				});
			});
    },
    function(arr,cb){
      //在topic中查找他关注用户的话题
			global.db.collection('topic',function(err,collection){
				collection.find({$or:arr}).sort({_id: -1}).skip(num).limit(size).toArray(function(err,items){
					if(err){
						callback({isOk:false});
					}else{
						callback({isOk:true,data:items});
					}
				});
			}); 
    }
  ]);
};

//@ 股票的话题
topic.stockTopic=function(uid,stockName,size,num,callback){
	global.db.collection('topic',function(err,collection){
		collection.find({$or:[{aboutStockcode:uid},{aboutStockName:stockName}]}).sort({_id: -1}).skip(num).limit(size).toArray(function(err,items){
			if(err){
				callback({isOk:false});
			}else{
				callback({isOk:true,data:items});
			}
		});
	});
};

//用户关注的股票的相关话题
topic.aboutStockTopic=function(name,size,num,callback){
	//先查找这个用户关注的股票
	// global.db.collection('user',function(err,collection){
	// 	collection.findOne({name:name},function(err,obj){
	// 		if(!err){
	// 			if(!!obj&&obj.stock.length>0){
	// 				//存在关注
	// 				var arr=[];
	// 				//这里只能查询sh600171这种code代码
	// 				obj.stock.forEach(function(k){
	// 					arr.push({aboutStockcode:k});
	// 				});
	// 				//在topic中查找他关注用户的话题
	// 				global.db.collection('topic',function(err,collection){
	// 					collection.find({$or:arr}).sort({_id: -1}).skip(num).limit(size).toArray(function(err,items){
	// 						if(err){
	// 							callback({isOk:false});
	// 						}else{
	// 							callback({isOk:true,data:items});
	// 						}
	// 					});
	// 				});
	// 			}else{
	// 				callback({isOk:true,data:[]});
	// 			}
	// 		}
	// 	});
	// });

	async.waterfall([
    function(cb){
    	//先查找这个用户关注的股票
			global.db.collection('user',function(err,collection){
				collection.findOne({name:name},function(err,obj){
					if(!err){
						if(!!obj&&obj.stock.length>0){
							//存在关注
							var arr=[];
							//这里只能查询sh600171这种code代码
							obj.stock.forEach(function(k){
								arr.push({aboutStockcode:k});
							});
							cb(null,arr);
						}else{
							callback({isOk:true,data:[]});
						}
					}
				});
			});
    },
    function(arr,cb){
      //在topic中查找他关注用户的话题
			global.db.collection('topic',function(err,collection){
				collection.find({$or:arr}).sort({_id: -1}).skip(num).limit(size).toArray(function(err,items){
					if(err){
						callback({isOk:false});
					}else{
						callback({isOk:true,data:items});
					}
				});
			});
    }
  ]);
};

//@ 我的话题
topic.atmeTopic=function(name,size,num,callback){
	global.db.collection('topic',function(err,collection){
		collection.find({$or:[{aboutPeople:name}]}).sort({_id: -1}).skip(num).limit(size).toArray(function(err,items){
			if(err){
				callback({isOk:false});
			}else{
				callback({isOk:true,data:items});
			}
		});
	});
};

/*
评论数据库
*/
//添加话题的评论
topic.addComment=function(isForward,obj,callback){
	// global.db.collection('comment',function(err,collection){
	// 	collection.insert(obj,{safe: true},function(err,topicItem){
	// 		if(!err){
	// 			if(isForward){
	// 				//topic 评论量+1,转发+1操作
	// 				global.db.collection('topic',function(err,collection){
	// 					var pid=Number(obj.pid);
	// 					collection.update({uid:pid},{$inc:{comment:1,forward:1}},function(err,items){
	// 						callback({isOk:true,data:topicItem,add:"commentAndForward"});
	// 					});
	// 				});
	// 			}else{
	// 				//topic 评论量+1操作
	// 				global.db.collection('topic',function(err,collection){
	// 					var pid=Number(obj.pid);
	// 					collection.update({uid:pid},{$inc:{comment:1}},function(err,items){
	// 						callback({isOk:true,data:topicItem,add:"comment"});
	// 					});
	// 				});
	// 			}
	// 		}
	// 	});
 //  });

	//异步执行
  async.parallel([
    function(cb){
    	//将评论插入comment表
      global.db.collection('comment',function(err,collection){
				collection.insert(obj,{safe: true},function(err,topicItem){
					cb(null, topicItem);
				});
		  });
    },
    function(cb){
    	//同时更新topic表中被评论的部分
      if(isForward){
      	//topic 评论量+1,转发+1操作
				global.db.collection('topic',function(err,collection){
					var pid=Number(obj.pid);
					collection.update({uid:pid},{$inc:{comment:1,forward:1}},function(err,items){
						cb(null,"commentAndForward");
						//callback({isOk:true,data:topicItem,add:"commentAndForward"});
					});
				});
      }else{
      	//topic 评论量+1操作
				global.db.collection('topic',function(err,collection){
					var pid=Number(obj.pid);
					collection.update({uid:pid},{$inc:{comment:1}},function(err,items){
						cb(null,"comment");
						//callback({isOk:true,data:topicItem,add:"comment"});
					});
				});
      }
    }
	],
	function(err, results){
		callback({isOk:true,data:results[0],add:results[1]});
	});
};

//获取话题的评论
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
};