var mongodb = require('../models/db');
//var crypto = require('crypto');
var User = require('../models/user');

var stock={};
module.exports = stock;

stock.show = function(req,res){
	res.render('stock', { 
		user:req.session.user 
	});
}