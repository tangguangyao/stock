var mongodb = require('./db');

function Stoc(sto){ 
  this.name = sto.name; 
  this.uid = sto.uid; 
  this.beWatch = sto.beWatch; 
  this.top = sto.top; 
  this.talk=sto.talk||[];
};

module.exports = Stoc;

Stoc.prototype.watch=function(callback){ 
 //callback 是执行玩保存后的回调函数
  var stoc = { 
      name : this.name,
	  uid = this.uid,
	  beWatch = this.beWatch,
	  top = this.top,
	  talk=this.talk
  };
  //top需要加减，beWatch需要加减处理
  //打开数据库
  mongodb.open(function(err,db){ 
    if(err){ 
      return callback(err); 
    } 
    //连接数据库中的名为user的表，没有就创建
    if(stoc.top){//增加热度
    	db.collection('stock',function(err,collection){ 
	      if(err){ 
	        mongodb.close(); 
	        return callback(err); 
	      }
	      db.user.update({uid:stoc.uid},{$inc:{top:1},$push:{beWatch:stoc.beWatch}}});
	      mongodb.close();
	      // collection.insert(stoc,{safe: true},function(err,stoc){ 
	      //   mongodb.close(); 
	      //   callback(err, stoc);
	      // }); 
	    }); 
    }else{//减少热度
    	// db.collection('stock',function(err,collection){ 
	    //   if(err){ 
	    //     mongodb.close(); 
	    //     return callback(err); 
	    //   } 
	    //   collection.insert(stoc,{safe: true},function(err,stoc){ 
	    //     mongodb.close(); 
	    //     callback(err, stoc);
	    //   }); 
	    // }); 
    }
    
  }) 
}