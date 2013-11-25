var mongodb = require('../models/db');

var User = require('../models/user');
var Stoc = require('../models/stoc');

var people={};
module.exports = people;

people.show=function(req,res){
	var name=req.params.name;
	var myName=req.session.user.name;
	User.get(name,function(err,data){
		User.isWatch(myName,name,function(info){
			res.render('people', {
				user:req.session.user,
				people:data,
				isWatch:info
			});
		});
	});	
}

people.watchPeople=function(req,res){
	var name=req.query.name;
	User.watch(true,req,name,function(err,data){
		if(err){
			res.send({ok:false});
		}else{
			req.session.user.watch.push(name);
			res.send({ok:true});
		}
	});
}

people.unwatchPeople=function(req,res){
	var name=req.query.name;
	User.watch(false,req,name,function(err,data){
		if(err){
			res.send({ok:false});
		}else{
			var len=req.session.user.watch;
			var newArr=[];
			for(var i=0,l=len.length;i<l;i++){
				if(len[i]==name){
					continue;
				}
				newArr.push(len[i]);
			}
			req.session.user.watch=newArr;
			res.send({ok:true});
		}
	});
}

people.watchTab=function(req,res){
	var name=req.query.name;
	var pageNum=req.query.pageNum;//20
	var pageSize=req.query.pageSize;//2
	var myName=req.session.user.name;
	//这里存在性能问题，如果关注量，被关注量特别大会肯出问题
	var myWatch=req.session.user.watch;//["tang","guang","yao"]
	User.watchPage(name,function(err,data){
		var num=data.watch.length>pageSize*(pageNum+1)?pageSize*(pageNum+1):data.watch.length;
		var watchArr=[];
		for(var k=pageSize*pageNum,l=num;k<l;k++){
			watchArr.push({haveWatch:false,name:data.watch[k]});
			for(var j=0,l2=myWatch.length;j<l2;j++){
				if(data.watch[k]==myWatch[j]){
					watchArr[k].haveWatch=true;
				}
			}
		}
		res.send({ok:true,list:watchArr});
	});
}