var mongodb = require('../models/db');
//var crypto = require('crypto');
var User = require('../models/user');

var stock={};
module.exports = stock;

stock.show = function(req,res){
	var id=/[0-9]{6}/.exec(req.params.uid)
	res.render('stock', {
		id:id,
		user:req.session.user 
	});
}