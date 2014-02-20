/*
股票功能
*/

var mongodb = require('../models/db');
//var crypto = require('crypto');
var User = require('../models/user');
var Stoc = require('../models/stoc');

var stock={};
module.exports = stock;

stock.show = function(req,res){
	req.params.uid=req.params.uid.toLowerCase();//统一小写后处理
	var id=/[0-9]{6}/.exec(req.params.uid);//左边导航需要
	var isWatch=false;
	if(req.session.user){
		for(var i=0,l=req.session.user.stock.length;i<l;i++){
			if(req.params.uid==req.session.user.stock[i]){
				isWatch=true;
			}
		}
	}
	
	res.render('stock', {
		id:id,
		isWatch:isWatch,
		user:req.session.user
	});
};

stock.watch=function(req,res){
	var stoc = new Stoc({
		name: req.query.name, 
		uid: req.query.uid,
		top: req.query.add,
		beWatch: {
			name:req.query.beWatchName,
			top:req.query.beWatchTop
		} 
	});
	//插入stock数据
	stoc.watch(function(data){
		if(data.status==200){
			if(req.query.add==1){
				req.session.user.stock.push(data.uid);
			}else{
				var newSe=[];
				for(var i=0,l=req.session.user.stock.length;i<l;i++){
					if(req.session.user.stock[i]!=data.uid){
						newSe.push(req.session.user.stock[i]);
					}
				}
				req.session.user.stock=newSe;
			}
			res.send({ok:true});
		}
	});
};

stock.aboutName=function(req,res){
	var uid=req.query.uid;
	Stoc.aboutName(uid,function(obj){
		if(obj){
			res.send({ok:true,info:obj});
		}else{
			res.send({ok:false});
		}
	});
};

stock.hotStock=function(req,res){
	Stoc.hotStock(function(obj){
		res.send({ok:true,list:obj});
	});
};

stock.bigpipeHotStock=function(callback){
	Stoc.hotStock(function(obj){
		//res.send({ok:true,list:obj});
		callback({ok:true,list:obj})
	});
};

stock.talkHistory=function(req,res){
	var uid=req.query.stock;
	var num=req.query.num;
	var count=Number(num);
	Stoc.talkHistory(uid,count,function(info){
		if(info.length>0){
			res.send({ok:true,history:info[0].history});
		}else{
			res.send({ok:false});
		}
	});
};

/*
*重构
*/
stock.showAjax = function(req,res){
	req.params.uid=req.params.uid.toLowerCase();//统一小写后处理
	var id=/[0-9]{6}/.exec(req.params.uid);//左边导航需要
	var isWatch=false;
	if(req.session.user){
		for(var i=0,l=req.session.user.stock.length;i<l;i++){
			if(req.params.uid==req.session.user.stock[i]){
				isWatch=true;
			}
		}
	}
	
	res.send({
		id:id,
		isWatch:isWatch,
		user:req.session.user
	});
};