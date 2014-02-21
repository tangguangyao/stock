/*
用户行为功能
*/

var mongodb = require('../models/db');

var User = require('../models/user');
var Stoc = require('../models/stoc');

var people={};
module.exports = people;

people.show=function(req,res){
	var name=req.params.name;
	if(req.session.user){//已登录用户
		var myName=req.session.user.name;
		User.get(name,function(err,data){
			if(name==myName){
				res.render('people', {
					user:req.session.user,
					people:data,
					isWatch:"myself"
				});
			}else{
				User.isWatch(myName,name,function(info){
					res.render('people', {
						user:req.session.user,
						people:data,
						isWatch:info
					});
				});
			}
		});
	}else{
		User.get(name,function(err,data){
			res.render('people', {
				user:req.session.user,
				people:data,
				isWatch:false
			});
		});
	}
};

people.watchPeople=function(req,res){
	var name=req.query.name;
	var fromName=req.session.user.name;
  var watch=req.session.user.watch;
	User.watch(true,fromName,watch,name,function(err,data){
		if(err){
			res.send({ok:false,message:err});
		}else{
			if(data.ok){
				req.session.user.watch.push(name);
				res.send({ok:true});
			}else{
				res.send({ok:false,message:data.message});
			}
		}
	});
};

people.unwatchPeople=function(req,res){
	var name=req.query.name;
	var fromName=req.session.user.name;
  var watch=req.session.user.watch;
	User.watch(false,fromName,watch,name,function(err,data){
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
};

people.watchTab=function(req,res){
	var name=req.query.name;
	var pageNum=Number(req.query.pageNum);//20
	var pageSize=req.query.pageSize;//2
	var nameWatch;//本页用户关注的对象
	var num,watchArr=[];
	if(req.session.user){//已经登录用户，需要判断列表中用户是否已经关注过
		var myName=req.session.user.name;
		//这里存在性能问题，如果关注量，被关注量特别大会肯出问题
		var myWatch=req.session.user.watch;//["tang","guang","yao"]
		if(myName!=name){
			//不是是自己的页面
			if(pageNum===0){
				User.watchPage(name,function(err,data){
					//第一次分页获取所有值
					nameWatch=data.watch;
					var watchArray=watchPageOther(myName,myWatch,nameWatch,pageSize,pageNum);
					res.send({ok:true,list:watchArray});
				});
			}else{
				var watchArray=watchPageOther(myName,myWatch,nameWatch,pageSize,pageNum);
				res.send({ok:true,list:watchArray});
			}
		}else{
			num=myWatch.length>pageSize*(pageNum+1)?pageSize*(pageNum+1):myWatch.length;
			for(var k=pageSize*pageNum,l=num;k<l;k++){
				watchArr.push({haveWatch:true,name:myWatch[k],myself:false});
			}
			res.send({ok:true,list:watchArr});
		}
	}else{
		//noLoginWatch(name,nameWatch,pageNum,pageSize);
		if(pageNum===0){
			User.watchPage(name,function(err,data){
				//第一次分页获取所有值
				nameWatch=data.watch;
				num=nameWatch.length>pageSize*(pageNum+1)?pageSize*(pageNum+1):nameWatch.length;
				//watchArr=[];
				for(var k=pageSize*pageNum,l=num;k<l;k++){
					watchArr.push({haveWatch:false,name:nameWatch[k],myself:false});
				}
				//var watchArray=watchPageOther(myName,myWatch,nameWatch,pageSize,pageNum);
				res.send({ok:true,list:watchArr});
			});
		}else{
			num=nameWatch.length>pageSize*(pageNum+1)?pageSize*(pageNum+1):nameWatch.length;
			//watchArr=[];
			for(var k2=pageSize*pageNum,l2=num;k2<l2;k2++){
				watchArr.push({haveWatch:false,name:nameWatch[k2],myself:false});
			}
			//var watchArray=watchPageOther(myName,myWatch,nameWatch,pageSize,pageNum);
			res.send({ok:true,list:watchArr});
		}
	}
};

people.fensTab=function(req,res){
	var name=req.query.name;
	var pageNum=Number(req.query.pageNum);//20
	var pageSize=req.query.pageSize;//2
	var nameFens;//本页用户的粉丝
	var num,watchArr=[];
	if(req.session.user){
		var myName=req.session.user.name;
		//这里存在性能问题，如果关注量，被关注量特别大会肯出问题
		var myWatch=req.session.user.watch;//["tang","guang","yao"]
		var myFens=req.session.user.beWatch;
		if(myName!=name){
			//不是是自己的页面
			if(pageNum===0){
				User.watchPage(name,function(err,data){
					//第一次分页获取所有值
					nameFens=data.beWatch;
					var watchArray=watchPageOther(myName,myWatch,nameFens,pageSize,pageNum);
					res.send({ok:true,list:watchArray});
				});
			}else{
				var watchArray=watchPageOther(myName,myWatch,nameFens,pageSize,pageNum);
				res.send({ok:true,list:watchArray});
			}
		}else{
			num=myFens.length>pageSize*(pageNum+1)?pageSize*(pageNum+1):myFens.length;
			watchArr=[];
			for(var k=pageSize*pageNum,l=num;k<l;k++){
				watchArr.push({haveWatch:false,name:myFens[k],myself:false});
				for(var j=0,l2=myWatch.length;j<l2;j++){
					if(myFens[k]==myWatch[j]){
						watchArr[k].haveWatch=true;
					}
				}
			}
			res.send({ok:true,list:watchArr});
		}
	}else{
		//noLoginWatch(name,nameFens,pageNum,pageSize);
		if(pageNum===0){
			User.watchPage(name,function(err,data){
				//第一次分页获取所有值
				nameFens=data.beWatch;
				num=nameFens.length>pageSize*(pageNum+1)?pageSize*(pageNum+1):nameFens.length;
				watchArr=[];
				for(var k=pageSize*pageNum,l=num;k<l;k++){
					watchArr.push({haveWatch:false,name:nameFens[k],myself:false});
				}
				//var watchArray=watchPageOther(myName,myWatch,nameFens,pageSize,pageNum);
				res.send({ok:true,list:watchArr});
			});
		}else{
			num=nameFens.length>pageSize*(pageNum+1)?pageSize*(pageNum+1):nameFens.length;
			watchArr=[];
			for(var k3=pageSize*pageNum,l3=num;k3<l3;k3++){
				watchArr.push({haveWatch:false,name:nameFens[k3],myself:false});
			}
			//var watchArray=watchPageOther(myName,myWatch,nameFens,pageSize,pageNum);
			res.send({ok:true,list:watchArr});
		}
	}
};

//首页热门用户
people.hotPeople=function(req,res){
	var myName=req.session.user.name;
	var myWatch=req.session.user.watch;
	User.hotPeople(function(obj){
		for(var i=0,l=obj.length;i<l;i++){
			obj[i].isWatch=false;
			obj[i].password=null;
			for(var j=0,l2=myWatch.length;j<l2;j++){
				if(obj[i].name==myWatch[j]){
					obj[i].isWatch=true;
				}
			}
		}
		res.send({ok:true,list:obj});
	});
};

//bigpipe 获取热门用户
people.bigpipeHotPeople=function(req,res,callback){
	var myName=req.session.user.name;
	var myWatch=req.session.user.watch;
	User.hotPeople(function(obj){
		for(var i=0,l=obj.length;i<l;i++){
			obj[i].isWatch=false;
			obj[i].password=null;
			for(var j=0,l2=myWatch.length;j<l2;j++){
				if(obj[i].name==myWatch[j]){
					obj[i].isWatch=true;
				}
			}
		}
		//res.send({ok:true,list:obj});
		//假设服务器慢，有个延迟
		setTimeout(function(){
			callback({ok:true,list:obj});
		}, 1000);
	});
};

//判断myName用户关注的用户myWatch是否在nameWatch中
var watchPageOther=function(myName,myWatch,nameWatch,pageSize,pageNum){
	var num=nameWatch.length>pageSize*(pageNum+1)?pageSize*(pageNum+1):nameWatch.length;
	var watchArr=[];
	for(var k=pageSize*pageNum,l=num;k<l;k++){
		if(nameWatch[k]==myName){
			watchArr.push({haveWatch:false,name:nameWatch[k],myself:true});
		}else{
			watchArr.push({haveWatch:false,name:nameWatch[k],myself:false});
		}
		for(var j=0,l2=myWatch.length;j<l2;j++){
			if(nameWatch[k]==myWatch[j]){
				watchArr[k].haveWatch=true;
			}
		}
	}
	return watchArr;
};


/*
*重构前端ajax接口
*/
people.showAjax=function(req,res){
	var name=req.query.name;
	if(req.session.user){//已登录用户
		var myName=req.session.user.name;
		User.get(name,function(err,data){
			if(name==myName){
				res.send({
					user:req.session.user,
					people:data,
					isWatch:"myself"
				});
			}else{
				User.isWatch(myName,name,function(info){
					res.send({
						user:req.session.user,
						people:data,
						isWatch:info
					});
				});
			}
		});
	}else{
		User.get(name,function(err,data){
			res.send({
				user:req.session.user,
				people:data,
				isWatch:false
			});
		});
	}
};