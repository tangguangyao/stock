var mongodb = require('./db');

module.exports = function(io){
  //存储在线用户列表
  var users = [];
  var stockRoom=[];//缓存聊天信息
  var chat = io.of('/chat').on('connection',function(socket){
    //接受用户聊天，并且分聊天室发出
    socket.on('talk',function(data,fn){
      //返给前端
      fn({isok:true});
      var date=new Date();
      var time=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
      stockRoom.forEach(function(room){
        if(room.stock==data.room){
          room.text.push({
            name:data.name,
            text:data.text,
            time:time
          });
        }
      })
      //给指定用户发送消息
      chat.clients().forEach(function(client){
        if(client.room){
          if(client.room.stock == data.room){
            //将不同聊天室的消息分发到不同聊天室
            client.emit('showTalk',{
              name:data.name,
              text:data.text,
              time:time
            });
          }
        }  
			});
    });
    //接受用户加入聊天室消息，并且分组
    socket.on('add',function(data,callback){
      //添加一个聊天室信息到socket属性中
      socket.room={
        stock:data.stock,
        user:data.name
      };

      //缓存临时数据
      stockRoom.forEach(function(room){
        if(room.stock==data.stock){
          room.user.push(data.name);
          //返回缓存信息
          callback({cache:true,text:room.text});
          return;
        }
      });

      //不存在频道就新建一个频道
      stockRoom.push({
        stock:data.stock,
        user:[data.name],
        text:[]
      });
      callback({cache:false});
    });

    //监听页面关闭,当一个聊天室用户为0时，数据存入服务器，并且从stockRoom中删除
    socket.on('disconnect',function(){
      //若 users 数组中保存了该用户名
      if(socket.room){
        var uid=socket.room.stock;
        var user=socket.room.user;
      }
      //检测如果存在，就从stockRoom中删除
      //跑这么多，感觉高并发会有性能问题
      stockRoom.forEach(function(room,i){
        if(room.stock==uid){
          var index=room.user.indexOf(user);
          if(index>-1){
            room.user.splice(index,1);
            if(room.user==0){
              //如果用户为0，数据存入数据库

              //并且移除stockRoom[i]
              stockRoom.splice(i,1);
            }
          }
        }
      });
    });
  });
};