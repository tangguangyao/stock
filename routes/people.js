var mongodb = require('../models/db');

var User = require('../models/user');
var Stoc = require('../models/stoc');

var people={};
module.exports = people;

people.show=function(req,res){
	var name=req.params.name;
	var myName=req.session.user.name;
	User.get(name,function(err,data){
		User.isWatch(myName,name,function(){
			res.render('people', {
				user:req.session.user,
				people:data
			});
		});
	});	
}

people.watchPeople=function(req,res){
	var name=req.query.name;
	User.watch(true,req,name,function(err,data){
		var l;
		res.send({ok:true});
	});
}

people.unwatchPeople=function(req,res){
	var name=req.query.name;
	User.watch(false,req,name,function(err,data){
		var l;
		res.send({ok:true});
	});
}