/*
聊天室功能
*/
var room = require('../models/room');

var stockroom={};

module.exports = stockroom;

stockroom.talkHistory=function(req,res){
	var uid=req.query.stock;
	var num=req.query.num;
	var count=Number(num);
	room.talkHistory(uid,count,function(info){
		if(info.length>0){
			res.send({ok:true,history:info[0].history});
		}else{
			res.send({ok:false});
		}
	});
};