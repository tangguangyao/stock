var stock={};
//公共函数，提取评论信息
stock.textExtract=function(comment,name){
	//正则获取@ 的用户,用户名3-15个英文或数字
	var aboutPeople=comment.match(/@\w{3,15}\s|@\w{3,15}$/g);
	if(!!aboutPeople){
	  for(var i1=0,l1=aboutPeople.length;i1<l1;i1++){
	    aboutPeople[i1]=aboutPeople[i1].replace(" ","").replace(/@/,"");
	  }
	}else{
	  aboutPeople=[];
	}
	//正则获取$$ 的股票代码/sh[0-9]{6}|sz[0-9]{6}/i
	var aboutStockcode=comment.match(/\$sh[0-9]{6}\$|\$sz[0-9]{6}\$/ig);
	if(!!aboutStockcode){
	  for(var i2=0,l2=aboutStockcode.length;i2<l2;i2++){
	    aboutStockcode[i2]=aboutStockcode[i2].replace(/\$/g,"");
	  }
	}else{
	  aboutStockcode=[];
	}
	//正则获取股票名称
	var aboutStockName=comment.match(/\$[\u4e00-\u9fa5]{2,6}\$/ig);
	if(!!aboutStockName){
	  for(var i3=0,l3=aboutStockName.length;i3<l3;i3++){
	    aboutStockName[i3]=aboutStockName[i3].replace(/\$/g,"");
	  }
	}else{
	  aboutStockName=[];
	}
	//前端解析的对象
	var commentObj={
	  topic:comment,
	  name:name,
	  aboutPeople:aboutPeople,
	  aboutStockcode:aboutStockcode,
	  aboutStockName:aboutStockName
	}
	return commentObj;
}

stock.commentTopic=function(myTopic,e,callback){
  var thisTopicComment=$(e.target);
  if(!myTopic.toCoShow){
    myTopic.toCoShow=true;
    if(myTopic.comment>0 && thisTopicComment.attr("data-first")=="yes"){
    	thisTopicComment.attr("data-first","no");
      //评论大于0 并且第一次打开
      callback();
    }
  }else{
    myTopic.toCoShow=false;
  }
}

stock.comRe=function(comment){
	comment.commentReText="回复@"+comment.name+" :";
  comment.reShow=!comment.reShow?true:false;
}

//所以需要$http,$scope 的公共函数写在下面，统一传入angularjs作用域内容
stock.angular=function($http,$scope,myName,selfName){
	var $http=$http,
			$scope=$scope,
			myName=myName,
			selfName=selfName;
	var openMyTopic=true;
	return {
		clickmyTopic:function(){
			var _this=this;
			//获取我的话题
  		//初始化我的话题
			$scope.myTopic=function(){
		    if(openMyTopic){
		      _this.getMyTopic(myName,10,0);
		    }
		  }
		},
		havemyTopic:function(){
		  this.getMyTopic(myName,10,0);
		},
		init:function(){
			var _this=this;
		  /*
		  评论模块
		  */
		  //点击评论,获取评论
		  $scope.commentTopic=function(myTopic,e){
		    stock.commentTopic(myTopic,e,function(){
		      //评论大于0 并且第一次打开
		      _this.getComment(myTopic.uid,10,0,function(data){
		        //双层嵌套
		        //这里需要后台过滤数据内容
		        myTopic.comlist=data.data;
		      });
		    });
		  }
		  //展开回复评论
		  $scope.comRe=function(comment){
		    stock.comRe(comment);
		  }

		  //提交话题评论
		  $scope.submitCommentTopic=function(e,myTopic){
		    //var textComment=myTopic.topicCommentText;
		    if(myTopic.topicCommentText==""){
		      alert("请填写评价");
		    }else{
		      //判断是否转发
		      var commentObj=stock.textExtract(myTopic.topicCommentText,selfName);
		      commentObj.pid=myTopic.uid;
		      
		      if(myTopic.ifForward){
		        //是转发
		        commentObj.isForward=true;
		        commentObj.forwardObj={
		          topic:myTopic.topic,
		          time:myTopic.time,
		          name:myTopic.name
		        }

		        //存在转发内容，需要组合
		        if(myTopic.isForward){
		          commentObj.topic=commentObj.topic+"//@"+myTopic.forwardObj.name+":"+myTopic.forwardObj.topic;
		        }

		        $http.post("/submitCommentTopic", commentObj).
		          success(function(data,status){
		            if(data.isok){
		              //展示刚刚转发内容
		              if(myName==selfName){
		              	$scope.myTopicList.unshift(data.topic.data[0]);
		              }
		              
		              //处理评论
		              //成功后评论+1,转发+1
		              myTopic.comment++;
		              myTopic.forward++;
		              //清空评论
		              $(e.target).parent().parent().find(".topicCommentText").val("");
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
		      }else{
		        //不是转发
		        commentObj.isForward=false;
		        $http.post("/submitCommentTopic", commentObj).
		          success(function(data,status){
		            if(data.isOk){
		              //成功后评论+1
		              myTopic.comment++;
		              //清空评论
		              $(e.target).parent().parent().find(".topicCommentText").val("");
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
		      }
		    }
		  }

		  //提交回复评论
		  $scope.commentRe=function(comment,myTopic){
		    var reComment,//回复内容
		        commentObj;
		    reComment=comment.commentReText;
		    commentObj=stock.textExtract(reComment,selfName);
		    commentObj.pid=myTopic.uid;
		    if(myTopic.ifForwardRe){
		      //是转发
		      commentObj.isForward=true;
		      commentObj.forwardObj={
		        topic:myTopic.topic,
		        time:myTopic.time,
		        name:myTopic.name
		      }

		      //存在转发内容，需要组合
		      commentObj.topic=comment.commentReText+"//@"+comment.name+" :"+comment.topic+"//@"+myTopic.name+" :"+myTopic.topic;
		      commentObj.pid=myTopic.uid;

		      $http.post("/submitCommentTopic", commentObj).
		        success(function(data,status){
		          if(data.isok){
		          	if(myName==selfName){
		          		//展示刚刚转发内容
		            	$scope.myTopicList.unshift(data.topic.data[0]);
		          	}
		            
		            //处理评论
		            //成功后评论+1,转发+1
		            myTopic.comment++;
		            myTopic.forward++;
		            //清空评论
		            comment.commentReText="";
		            //新加评论插入第一个
		            var obj={
		              name:data.comment[0].name,
		              time:data.comment[0].time,
		              topic:data.comment[0].topic
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
		    }else{
		      //不是转发
		      commentObj.isForward=false;
		      $http.post("/submitCommentTopic", commentObj).
		        success(function(data,status){
		          if(data.isOk){
		            //成功后评论+1
		            myTopic.comment++;
		            //清空评论
		            comment.commentReText="";
		            //新加评论插入第一个
		            var obj={
		              name:data.data[0].name,
		              time:data.data[0].time,
		              topic:data.data[0].topic
		            }
		            myTopic.comlist.unshift(obj);
		          }else{
		            alert("提交失败!");
		          }
		        });
		    }
		  }

		},
		//加载我的话题函数
		getMyTopic:function(name,pageSize,pageNum){
			$http({method: "GET", url: "/myTopic?name="+name+"&pageNum="+pageNum+"&pageSize="+pageSize}).
			  success(function(data,status){
			    if(data.isOk){
			      openMyTopic=false;
			      $scope.myTopicList=data.data;
			    }else{
			      alert("获取失败")
			    }
			  });
		},
		//加载话题的评论
		getComment:function(uid,pageSize,pageNum,callback){
	    $http({method: "GET", url: "/getComment?uid="+uid+"&pageNum="+pageNum+"&pageSize="+pageSize}).
	      success(function(data,status){
	        if(data.isOk){
	          //$scope.myTopicList=data.data;
	          callback(data);
	        }else{
	          alert("获取失败")
	        }
	      });
  	}
	}
};