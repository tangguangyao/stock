var mongodb = require('../models/db');
var User = require('../models/user');

var setting={};
module.exports = setting;

setting.show=function(req,res){
	if(req.session.user){
		res.render('setting', {
			user:req.session.user
		});
	}else{
		res.redirect('/login');
	}
	
}