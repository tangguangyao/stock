var mongodb = require('./db');
var user = require('./user');

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
	  uid : this.uid,
	  beWatch : this.beWatch,
	  top : this.top,
	  talk : this.talk
  };
  var watchName=stoc.beWatch;
  //top需要加减，beWatch需要加减处理
  //打开数据库
  mongodb.open(function(err,db){ 
    if(err){ 
      return callback(err); 
    } 
    //连接数据库中的名为user的表，没有就创建
    if(stoc.top==1){//增加热度
    	//更新,新增股票的表
    	db.collection('sto',function(err,collection){ 
	      if(err){ 
	        mongodb.close(); 
	        return callback(err); 
	      }
	      collection.find({uid:stoc.uid}).toArray(function(err,items){ 
	        if(err) throw err; 
	        if(items.length==0){
	        	//创建一个新的
	        	stoc.beWatch=[stoc.beWatch];
	        	stoc.top=1;
	        	collection.insert(stoc,{safe: true},function(err,stocItem){
	        		if(err){ 
				        mongodb.close(); 
				        return callback(err); 
				      }

        			//更新用户的表
        			user.stockUp(db,watchName,stoc.uid,true,function(err,items){
        				if(err) throw err;
				        mongodb.close();
				        return callback({status:200,uid:stoc.uid});
        			})

			      }); 
	        }else{
	        	//防止前端bug重复添加同一用户
	        	for(var i=0,l=items[0].beWatch.length;i<l;i++){
	        		if(items[0].beWatch[i]==stoc.beWatch){
	        			return;
	        		}
	        	}
	        	//更新股票的表
	        	collection.update({uid:stoc.uid},{$inc:{top:1},$push:{beWatch:stoc.beWatch}},function(err,items){
				      	if(err) throw err;

				      	//更新用户的表
				      	user.stockUp(db,watchName,stoc.uid,true,function(err,items){
	        				if(err) throw err;
					        mongodb.close();
					        return callback({status:200,uid:stoc.uid});
	        			})
				      });
	        }
	      });
	    });
    }else{//减少热度
			db.collection('sto',function(err,collection){
				if(err){ 
	        mongodb.close(); 
	        return callback(err); 
	      }

	      //更新股票的表
      	collection.update({uid:stoc.uid},{$inc:{top:-1},$pull:{beWatch:stoc.beWatch}},function(err,items){
		      	if(err) throw err;

		      	//更新用户的表
		      	user.stockUp(db,watchName,stoc.uid,false,function(err,items){
        				if(err) throw err;
				        mongodb.close();
				        return callback({status:200,uid:stoc.uid});
        			})

		      });
			});
    }
  }) 
}

Stoc.aboutName=function(uid,callback){
	// mongodb.open(function(err,db){
	// 	if(err){ 
 //      return callback(err); 
 //    }
 //    db.collection('sto',function(err,collection){
 //    	if(err){ 
 //        mongodb.close(); 
 //        return callback(err); 
 //      }
 //      collection.find({uid:stoc.uid},{$inc:{top:-1},$pull:{beWatch:stoc.beWatch}},function(err,items){

 //      });
 //    });
	// });
}