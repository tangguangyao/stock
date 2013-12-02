var mongodb = require('./db');

module.exports = function(io){
  //存储在线用户列表
  var users = [];
  var stockTalk=[];
  var chat = io.of('/chat').on('connection',function(socket){
    socket.on('talk',function(data,fn){
      fn({isok:true});
      //给所有用户发送消息
      //chat.emit('showTalk',{ok:"1212"});
      
      //给指定用户发送消息
      chat.clients().forEach(function(client){
	      if(client.name == data.to){
	        //触发该用户客户端的 say 事件
	        client.emit('showTalk',{ok:"1212"});
			  }
			});
    });

    socket.on('add',function(data){
    	l=stockTalk.length
    	for(var i=0;i<l;i++){
    		if(stockTalk[i]==data.stock){
    			stockTalk[i].user.push(data.name);
    			return;
    		}
    	}
    	stockTalk.push(data.stock);
    	stockTalk[l].user.push(data.name);
    });
  });
};