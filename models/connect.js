var mongodb = require('./db');

mongodb.open(function(err,db){
	global.db=db;
});