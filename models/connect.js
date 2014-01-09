/*
保持数据库一直连接，保存一个全局变量
*/

var mongodb = require('mongodb').Db;
var settings = require('../settings');

// var mongodb = require('./db'),
// 	settings = require('../settings');

// mongodb.open(settings.url,function(err,db){
// 	global.db=db;
// });


mongodb.connect(settings.url, function (err, db) {
	global.db=db;
});