var mongodb = require('./db');

module.exports = function(io){
	//存储在线用户列表
	var users = [];
	var chat = io.of('/chat').on('connection',function(socket){
		socket.on('talk',function(data,fn){
			fn({isok:true});
			//给所有用户发送消息
			//chat.emit('showTalk',{ok:"1212"});
			
			//给指定用户发送消息
			chat.clients()[1].emit('showTalk',{ok:"1212"});
			
			// //将上线的用户名存储为 socket 对象的属性，以区分每个 socket 对象，方便后面使用
			// socket.name = data.user;
			// //数组中不存在该用户名则插入该用户名
			// if(users.indexOf(data.user) == -1){
			//   users.unshift(data.user);
			// }
			// //向所有用户广播该用户上线信息
			// io.sockets.emit('online',{users:users,user:data.user});
		});
	});
};
