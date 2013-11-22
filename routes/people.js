var mongodb = require('../models/db');

var User = require('../models/user');
var Stoc = require('../models/stoc');

var people={};
module.exports = people;

people.show=function(req,res){
	var name=req.params.name;
	User.get(name,function(err,data){
		res.render('people', {
			user:req.session.user,
			people:data
		});
	});	
}