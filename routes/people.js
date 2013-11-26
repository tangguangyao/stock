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
	var nameWatch;//本页用户关注的对象
	if(myName!=name){
		//不是是自己的页面
		if(pageSize==0){
			User.watchPage(name,function(err,data){
				//第一次分页获取所有值
				nameWatch=data.watch;
				var num=nameWatch.length>pageSize*(pageNum+1)?pageSize*(pageNum+1):nameWatch.length;
				var watchArr=[];
				for(var k=pageSize*pageNum,l=num;k<l;k++){
					watchArr.push({haveWatch:false,name:nameWatch[k]});
					for(var j=0,l2=myWatch.length;j<l2;j++){
						if(nameWatch[k]==myWatch[j]){
							watchArr[k].haveWatch=true;
						}
					}
				}
				res.send({ok:true,list:watchArr});
			});
		}else{
			var num=nameWatch.length>pageSize*(pageNum+1)?pageSize*(pageNum+1):nameWatch.length;
			var watchArr=[];
			for(var k=pageSize*pageNum,l=num;k<l;k++){
				watchArr.push({haveWatch:false,name:nameWatch[k]});
				for(var j=0,l2=myWatch.length;j<l2;j++){
					if(nameWatch[k]==myWatch[j]){
						watchArr[k].haveWatch=true;
					}
				}
			}
			res.send({ok:true,list:watchArr});
		}
	}else{
		var num=myWatch.length>pageSize*(pageNum+1)?pageSize*(pageNum+1):myWatch.length;
		var watchArr=[];
		for(var k=pageSize*pageNum,l=num;k<l;k++){
			watchArr.push({haveWatch:true,name:myWatch[k]});
		}
		res.send({ok:true,list:watchArr});
	}	
}

people.fensTab=function(req,res){
	var name=req.query.name;
	var pageNum=req.query.pageNum2;//20
	var pageSize=req.query.pageSize2;//2
	var myName=req.session.user.name;
	//这里存在性能问题，如果关注量，被关注量特别大会肯出问题
	var myFens=req.session.user.beWatch;//["tang","guang","yao"]
	var nameFens;//本页用户的粉丝
	if(myName!=name){
		//不是是自己的页面
		if(pageSize==0){
			User.watchPage(name,function(err,data){
				//第一次分页获取所有值
				nameFens=data.beWatch;
				var num=nameFens.length>pageSize*(pageNum+1)?pageSize*(pageNum+1):nameFens.length;
				var watchArr=[];
				for(var k=pageSize*pageNum,l=num;k<l;k++){
					watchArr.push({haveWatch:false,name:nameFens[k]});
					for(var j=0,l2=myFens.length;j<l2;j++){
						if(nameFens[k]==myFens[j]){
							watchArr[k].haveWatch=true;
						}
					}
				}
				res.send({ok:true,list:watchArr});
			});
		}else{
			var num=nameFens.length>pageSize*(pageNum+1)?pageSize*(pageNum+1):nameFens.length;
			var watchArr=[];
			for(var k=pageSize*pageNum,l=num;k<l;k++){
				watchArr.push({haveWatch:false,name:nameFens[k]});
				for(var j=0,l2=myFens.length;j<l2;j++){
					if(nameFens[k]==myFens[j]){
						watchArr[k].haveWatch=true;
					}
				}
			}
			res.send({ok:true,list:watchArr});
		}
	}else{
		var num=myFens.length>pageSize*(pageNum+1)?pageSize*(pageNum+1):myFens.length;
		var watchArr=[];
		for(var k=pageSize*pageNum,l=num;k<l;k++){
			watchArr.push({haveWatch:true,name:myFens[k]});
		}
		res.send({ok:true,list:watchArr});
	}
}