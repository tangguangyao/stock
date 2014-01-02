var mongodb = require('./models/db');
var connect=require('./models/connect');

setTimeout(function () {
	global.db.collection('user',function(err,collection){
		collection.remove({admin:100},function(err){});
	});
},50);