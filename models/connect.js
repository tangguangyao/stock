/*
保持数据库一直连接，保存一个全局变量
*/

var mongodb = require('./db');

mongodb.open(function(err,db){
  global.db=db;
});
