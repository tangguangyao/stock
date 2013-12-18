var topic={};
//公共函数，提取评论信息

//所以需要$http,$scope 的公共函数写在下面，统一传入angularjs作用域内容
topic.angular=function($http,$scope,myName,selfName){
	var $http=$http,
			$scope=$scope,
			myName=myName,
			selfName=selfName;
	var openMyTopic=true;

	return {
		//加载我的话题函数
		getAboutTopic:function(url,name,pageSize,pageNum,event){
			$http({method: "GET", url: "/"+url+"?name="+name+"&pageNum="+pageNum+"&pageSize="+pageSize}).
			  success(function(data,status){
			    if(data.isOk){
			      openMyTopic=false;
			      
			      //处理分页
			      if(event){
			      	event.attr("num",pageNum/10+1);
			      }
			      
			      if(pageNum==0){
			      	$scope.aboutTopicList=data.data;
			      }else{
			      	$scope.aboutTopicList=$scope.aboutTopicList.concat(data.data);
			      }
			      
			      //超过10条显示加载跟多
			      if(data.data.length==10){
			      	$scope.aboutTopicGetmore=true;
			      }else{
			      	$scope.aboutTopicGetmore=false;
			      }
			    }else{
			      alert("获取失败")
			    }
			  });
		},
		//初始化
		havemyTopic:function(){
		  this.getAboutTopic("aboutTopic",myName,10,0);
		},
		//初始化
		init:function(){
			var _this=this;

		  //提交话题评论
		  $scope.submitComAboutTopic=function(e,myTopic){
		    _this.subComTop(e,myTopic,function(data){
		    	if(!!$scope.myTopicList){
        		//在我的话题栏目展示刚刚转发内容
          	$scope.myTopicList.unshift(data);
          }
		    });
		  }

		  //提交回复评论
		  $scope.comAboutRe=function(comment,myTopic){
		  	_this.comRe(comment,myTopic,function(data){
		  		if(!!$scope.myTopicList){
        		//在我的话题栏目展示刚刚转发内容
          	$scope.myTopicList.unshift(data);
          }
		  	});
		  }
		  //加载更多
		  $scope.getAboutMore=function(e){
		  	var num=Number($(e.target).attr("num"));
		  	_this.getAboutTopic("aboutTopic",myName,10,num*10,$(e.target));
		  }
		},
		//处理话题评论过程
		subComTop:function(e,myTopic,callback){
			var _this=this;
			if(myTopic.topicCommentText==""){
	      alert("请填写评价");
	    }else{
	      var commentObj=stock.textExtract(myTopic.topicCommentText,selfName);
	      commentObj.pid=myTopic.uid;
	      if(myTopic.ifForward){
	        //是转发
	        //处理转发数据
	        stock.forwordObj(commentObj,myTopic);

	        //post数据和显示返回情况
	        _this.postComfor(commentObj,myTopic,null,function(data){
	        	callback(data);
	        });
	      }else{
	        //不是转发
	        _this.postComNofor(commentObj,myTopic);
	      }
	    }
		},
		//处理回复话题过程
		comRe:function(comment,myTopic,callback){
			var noText="回复@"+comment.name+" :";
	    if(comment.commentReText==noText){
	    	alert("请填写回复");
	    }else{
		    var commentObj=topic.textExtract(comment.commentReText,selfName);
		    commentObj.pid=myTopic.uid;
		    if(myTopic.ifForwardRe){
		      //是转发
		      //处理转发数据
	        stock.forwordObj(commentObj,myTopic,comment);
		      //post数据和显示返回情况
		      _this.postComfor(commentObj,myTopic,comment,function(data){

		      	callback(data);
						
		      });

		    }else{
		    	//不是转发
	        _this.postComNofor(commentObj,myTopic,comment);
		    }
	    }
		},
		// //加载话题的评论
		// getComment:function(uid,pageSize,pageNum,callback){
	 //    $http({method: "GET", url: "/getComment?uid="+uid+"&pageNum="+pageNum+"&pageSize="+pageSize}).
	 //      success(function(data,status){
	 //        if(data.isOk){
	 //          //$scope.myTopicList=data.data;
	 //          callback(data);
	 //        }else{
	 //          alert("获取失败")
	 //        }
	 //      });
  // 	},
  	//回复评论，非转发
  	postComNofor:function(commentObj,myTopic,comment){
  		commentObj.isForward=false;
      $http.post("/submitCommentTopic", commentObj).
        success(function(data,status){
          if(data.isOk){
            //成功后评论+1
            myTopic.comment++;
            //清空评论comment 不存在，清空话题评论，存在，清空评论的评论
            comment?comment.commentReText="":myTopic.topicCommentText="";
            //新加评论插入第一个
            var obj={
              name:data.data[0].name,
              time:data.data[0].time,
              topic:data.data[0].topic
            }
            if(myTopic.comlist){//存在就添加
              myTopic.comlist.unshift(obj);
            }else{//不存在,新建
              myTopic.comlist=data.data;
            }
          }else{
            alert("提交失败!");
          }
        });
  	},
  	//post回复，并且转发
  	postComfor:function(commentObj,myTopic,comment,callback){
  		$http.post("/submitCommentTopic", commentObj).
        success(function(data,status){
          if(data.isok){
          	//回调出路是否展示
          	callback(data.topic.data[0]);
            
            //处理评论
            //成功后评论+1,转发+1
            myTopic.comment++;
            myTopic.forward++;
            //清空评论
            comment?comment.commentReText="":myTopic.topicCommentText="";
            //新加评论插入第一个
            var obj={
              name:data.comment.data[0].name,
              time:data.comment.data[0].time,
              topic:data.comment.data[0].topic
            }
            if(myTopic.comlist){//存在就添加
              myTopic.comlist.unshift(obj);
            }else{//不存在,新建
              myTopic.comlist=data.comment.data;
            }
          }else{
            alert("提交失败!");
          }
        });
  	}
	}
};