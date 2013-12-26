/*
股票数据库存入，读取
*/
var mongodb = require('./db');
var user = require('./user');
var connect=require('./connect');

function Stoc(sto){ 
  this.name = sto.name; 
  this.uid = sto.uid; 
  this.beWatch = sto.beWatch; 
  this.top = sto.top; 
  this.talk=sto.talk||[];
}

module.exports = Stoc;

Stoc.prototype.watch=function(callback){ 
	//callback 是执行玩保存后的回调函数
	var stoc = { 
		name : this.name,
		uid : this.uid,
		beWatch : this.beWatch,
		top : this.top,
		talk : this.talk
	};
	var watchName=stoc.beWatch;
	//top需要加减，beWatch需要加减处理
  //连接数据库中的名为user的表，没有就创建
  if(stoc.top==1){//增加热度
    //更新,新增股票的表
    global.db.collection('sto',function(err,collection){ 
      if(err){
        return callback(err); 
      }
      collection.find({uid:stoc.uid}).toArray(function(err,items){ 
        if(err) throw err; 
        if(items.length===0){
          //创建一个新的
          stoc.beWatch=[stoc.beWatch];
          stoc.top=1;
          collection.insert(stoc,{safe: true},function(err,stocItem){
            if(err){ 
              return callback(err); 
            }
            //更新用户的表
            user.stockUp(watchName,stoc.uid,true,function(err,items){
              if(err) throw err;
              return callback({status:200,uid:stoc.uid});
            });
          }); 
        }else{
          //防止前端bug重复添加同一用户
          for(var i=0,l=items[0].beWatch.length;i<l;i++){
            if(items[0].beWatch[i].name==stoc.beWatch.name){
              return callback({status:200,uid:stoc.uid,message:'已添加'});
            }
          }
          //更新股票的表
          collection.update({uid:stoc.uid},{$inc:{top:1},$push:{beWatch:stoc.beWatch}},function(err,items){
            if(err) throw err;
            //更新用户的表
            user.stockUp(watchName,stoc.uid,true,function(err,items){
              if(err) throw err;
              return callback({status:200,uid:stoc.uid});
            });
          });
        }
      });
    });
  }else{//减少热度
    global.db.collection('sto',function(err,collection){
      if(err){ 
        return callback(err); 
      }
      //更新股票的表
      collection.update({uid:stoc.uid},{$inc:{top:-1},$pull:{beWatch:stoc.beWatch}},function(err,items){
        if(err) throw err;
        //更新用户的表
        user.stockUp(watchName,stoc.uid,false,function(err,items){
          if(err) throw err;
          return callback({status:200,uid:stoc.uid});
        });
      });
    });
  }
};

Stoc.aboutName=function(uid,callback){
	global.db.collection('sto',function(err,collection){
		if(err){
      return callback(err); 
		}
		collection.findOne({uid:uid},function(err,items){
			if(err){
				return callback(err); 
			}
			if(!!items){//存在
				callback(items);
			}else{
				callback(null);
			}
		});
	});
};

Stoc.hotStock=function(callback){
  global.db.collection('sto',function(err,collection){
    if(err){ 
      return callback(err); 
    }
    collection.find().sort({top:-1}).limit(10).toArray(function(err,items){
      if(err){
        return callback(err); 
      }
      if(!!items){//存在
        callback(items);
      }else{
        callback(null);
      }
    });
  });
};