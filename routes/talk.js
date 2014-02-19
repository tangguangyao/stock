/*
评论功能
*/

var topic = require('../models/topic');
var redisCache = require('../models/redisCache');

var talk={};
module.exports = talk;

//过滤显示到前台的话题
var filterTopic=function(info){
	var obj={};
	obj.isOk=info.isOk;
	obj.data=[];
	info.data.forEach(function(data,i){
		if(data.isForward){
			obj.data[i]={
				forward:data.forward,
				name:data.name,
				time:data.time,
				topic:data.topic,
				uid:data.uid,
				comment:data.comment,
				isForward:data.isForward,
				forwardObj:data.forwardObj
			};
		}else{
			obj.data[i]={
				forward:data.forward,
				name:data.name,
				time:data.time,
				topic:data.topic,
				uid:data.uid,
				comment:data.comment,
				isForward:data.isForward
			};
		}
	});
	return obj;
};
//过滤评论数据
var filterComment=function(info){
	var obj={};
	obj.isOk=info.isOk;
	obj.data=[];
	info.data.forEach(function(data,i){
		obj.data[i]={
			name:data.name,
			time:data.time,
			topic:data.topic
		};
	});
	return obj;
};

talk.submitTopic=function(req,res){
	var date=new Date();
	var talkObj=req.body;
	//这里出于安全性考虑，后台赋值评论人，防止前台修改
	talkObj.name=req.session.user.name;
	//服务器上补充初始化信息
	talkObj.hide=false;//默认不隐藏
	talkObj.time=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes();
	//是否转发的判断
	talkObj.isForward=false;
	//初始转发和评论为0
	talkObj.comment=0;
	talkObj.forward=0;
	topic.addTopic(talkObj,function(info){
		var obj=filterTopic(info);
		//增加一个redis属性，判断是否需要更新redis
		redisCache.myTopic=true;
		res.send(obj);
	});
};

talk.myTopic=function(req,res){
	var name=req.query.name;
	var size=Number(req.query.pageSize);
	var num=Number(req.query.pageNum);
	topic.myTopic(name,size,num,function(info){
		//过滤数据
		var obj=filterTopic(info);
		res.send(obj);
	});
};

talk.submitCommentTopic=function(req,res){
	var date=new Date();
	var commentObj=req.body;
	//安全考虑，重新复制
	commentObj.name=req.session.user.name;
	commentObj.time=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes();
	commentObj.hide=false;//默认不隐藏

	//添加到评论中数据处理下
	var newCommentObj={
		pid:commentObj.pid,
		hide:commentObj.hide,
		time:commentObj.time,
		topic:commentObj.topic,
		name:commentObj.name,
		aboutPeople:commentObj.aboutPeople,
		aboutStockcode:commentObj.aboutStockcode,
		aboutStockName:commentObj.aboutStockName
	};
	if(commentObj.isForward){
		//转发后
		//存入我的话题
		var talkObj={
			hide:commentObj.hide,
			time:commentObj.time,
			topic:commentObj.topic,
			name:commentObj.name,
			aboutPeople:commentObj.aboutPeople,
			aboutStockcode:commentObj.aboutStockcode,
			aboutStockName:commentObj.aboutStockName,
			comment:0,
			forward:0,
			forwardObj:commentObj.forwardObj,
			isForward:commentObj.isForward
		};

		topic.addTopic(talkObj,function(data){
			topic.addComment(true,newCommentObj,function(info){
				//返回两个以存储数据
				var topicObj=filterTopic(data);
				var comObj=filterComment(info);
				//增加一个redis属性，判断是否需要更新redis
				redisCache.myTopic=true;
				res.send({isok:true,topic:topicObj,comment:comObj});
			});
		});
	}else{
		//存入评论数据库
		topic.addComment(false,newCommentObj,function(info){
			var comObj=filterComment(info);
			res.send(comObj);
		});
	}
};

talk.getComment=function(req,res){
	var uid=Number(req.query.uid);
	var size=Number(req.query.pageSize);
	var num=Number(req.query.pageNum);
	topic.getComment(uid,size,num,function(info){
		//过滤数据
		var obj=filterComment(info);
		res.send(obj);
	});
};

talk.aboutTopic=function(req,res){
	var name=req.query.name;
	var size=Number(req.query.pageSize);
	var num=Number(req.query.pageNum);
	topic.aboutTopic(name,size,num,function(info){
		//过滤数据
		var obj=filterTopic(info);
		res.send(obj);
	});
};

talk.stockTopic=function(req,res){
	var uid=req.query.uid;
	var stockName=req.query.stockName;
	var size=Number(req.query.pageSize);
	var num=Number(req.query.pageNum);
	topic.stockTopic(uid,stockName,size,num,function(info){
		//过滤数据
		var obj=filterTopic(info);
		res.send(obj);
	});
};

talk.aboutStockTopic=function(req,res){
	var name=req.query.name;
	var size=Number(req.query.pageSize);
	var num=Number(req.query.pageNum);
	topic.aboutStockTopic(name,size,num,function(info){
		//过滤数据
		var obj=filterTopic(info);
		res.send(obj);
	});
};

talk.atmeTopic=function(req,res){
	var name=req.query.name;
	var size=Number(req.query.pageSize);
	var num=Number(req.query.pageNum);
	topic.atmeTopic(name,size,num,function(info){
		//过滤数据
		var obj=filterTopic(info);
		res.send(obj);
	});
};

