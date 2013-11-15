var mongodb = require('../models/db');
//var crypto = require('crypto');
var User = require('../models/user');
var Stoc = require('../models/stoc');

var stock={};
module.exports = stock;

stock.show = function(req,res){
	var id=/[0-9]{6}/.exec(req.params.uid);
	res.render('stock', {
		id:id,
		user:req.session.user 
	});
}

stock.watch=function(req,res){
	var uid=req.params.uid;
	var stoc = new Stoc({
		name: "上海贝岭", 
		uid: "sh600171",
		top: true,
		beWatch: "guang" 
	});
	//插入stock数据
	stoc.watch(function(err, stoc){
		var l;
	})
	//插入user数据
	
}