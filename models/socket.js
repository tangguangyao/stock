var mongodb = require('./db');

module.exports = function(io){
  //存储在线用户列表
  var users = [];
  var stockRoom=[];
  var chat = io.of('/chat').on('connection',function(socket){
    socket.on('talk',function(data,fn){
      fn({isok:true});
      //给所有用户发送消息
      //chat.emit('showTalk',{ok:"1212"});
      
      //给指定用户发送消息
      chat.clients().forEach(function(client){
	      if(client.room.stock == data.room){
	        //触发该用户客户端的 say 事件
	        client.emit('showTalk',{ok:"1212"});
			  }
			});
    });

    socket.on('add',function(data){
    	for(var i=0,l=stockRoom.length;i<l;i++){
        //如果存在频道就将用户加入频道
    		if(stockRoom[i].stock==data.stock){
    			stockRoom[i].user.push(data.name);
          //socket.room=stockRoom;
          //放入socket属性中
          //socket.room.user.push(data.name);
          socket.room={
            stock:data.stock
            // user:[data.name],
            // text:[]
          };
    			return;
    		}
    	}
      //不存在频道就新建一个频道
    	stockRoom.push({
        stock:data.stock,
        user:[data.name],
        text:[]
      });
      //添加一个聊天室信息到socket属性中
      socket.room={
        stock:data.stock
        // user:[data.name],
        // text:[]
      };
    });
  });
};