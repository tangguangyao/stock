var mongodb = require('./db');
function User(user){ 
  this.name = user.name; 
  this.password = user.password; 
  this.info = user.info; 
  this.gupiao = user.gupiao; 
  this.watch=user.watch; 
  this.beWatch=user.beWatch; 
  this.top=user.top; 
  this.admin=user.admin; 
}; 

module.exports = User; 
User.prototype.save=function(callback){ 
 //callback 是执行玩保存后的回调函数
  var user = { 
      name: this.name, 
      password: this.password, 
      //下面内容在注册时不用填，在个人首页可以修改，所以先设置默认值和默认头像
      info:this.info||{
                        Spec: "code",
                        interest: "look",
                        pic:"images.jpg",
                        email:""
                      },
      stock:[],
      watch:[],
      beWatch:[],
      top:0,
      admin:3
  }; 
  //打开数据库
  mongodb.open(function(err,db){ 
    //如果打开出错，err会有出错信息，否则为null
    if(err){ 
      //将注册信息错误信息作为参数返回给回调函数
      return callback(err); 
    } 
    //连接数据库中的名为user的表，没有就创建
    db.collection('user',function(err,collection){ 
      //连接失败会将错误信息返回给回调函数，并且关闭数据库连接
      if(err){ 
        mongodb.close(); 
        return callback(err); 
      } 
       //插入新的数据
      collection.insert(user,{safe: true},function(err,result){ 
        //不管是否成功都关闭数据库
        mongodb.close(); 
        //如果错误err有错误信息，将err和user返回给回调函数
        callback(err, user);//成功！返回插入的用户信息 
      }); 
    }); 
  }) 
}
//读取用户信息 
User.get = function(name, callback){ 
  //打开数据库 
  mongodb.open(function(err, db){ 
    if(err){ 
      return callback(err); 
    } 
    //读取 users 集合 
    db.collection('user', function(err, collection){ 
      if(err){ 
        mongodb.close(); 
        return callback(err); 
      } 
      //查找用户名 name 值为 name文档 
      collection.findOne({name: name},function(err, doc){ 
        mongodb.close(); 
        if(doc){ 
          var user = new User(doc); 
          callback(err, user);//成功！返回查询的用户信息 
        } else { 
          callback(err, null);//失败！返回null 
        } 
      }); 
    }); 
  }); 
};