/*
评论功能
*/
var topic = require('../models/topic');

var talk={};

module.exports = talk;

var filterTopic=function(info){
	var obj={};
	obj.isOk=info.isOk;
	obj.data=[];
	info.data.forEach(function(data,i){
		obj.data[i]={
			forward:data.forward,
			name:data.name,
			time:data.time,
			topic:data.topic,
			uid:data.uid,
			comment:data.comment
		}
	});
	return obj;
}

talk.submitTopic=function(req,res){
	var date=new Date();
	var talkObj=req.body;
	//服务器上补充初始化信息
	talkObj.hide=false;//默认不隐藏
	talkObj.time=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
	//初始转发和评论为0
	talkObj.comment=0;
	talkObj.forward=0;
	topic.addTopic(talkObj,function(info){
		var obj=filterTopic(info);
		res.send(obj);
	});
}

talk.myTopic=function(req,res){
	var name=req.query.name;
	var size=Number(req.query.pageSize);
	var num=Number(req.query.pageNum);
	topic.myTopic(name,size,num,function(info){
		//过滤数据
		var obj=filterTopic(info);
		res.send(obj);
	});
}

talk.submitCommentTopic=function(req,res){
	var date=new Date();
	var commentObj=req.body;
	commentObj.time=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
	commentObj.hide=false;//默认不隐藏
	topic.addComment(commentObj,function(info){
		res.send(info);
	});
}

talk.getComment=function(req,res){
	var uid=Number(req.query.uid);
	var size=Number(req.query.pageSize);
	var num=Number(req.query.pageNum);
	topic.getComment(uid,size,num,function(info){
		//过滤数据
		var obj={};
		obj.isOk=info.isOk;
		obj.data=[];
		info.data.forEach(function(data,i){
			obj.data[i]={
				name:data.name,
				time:data.time,
				topic:data.topic
			}
		});
		res.send(obj);
	});
}