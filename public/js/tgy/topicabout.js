var topic={};
//公共函数，提取评论信息
topic.textExtract=function(comment,name){
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

topic.commentTopic=function(myTopic,e,callback){
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

topic.comRe=function(comment){
	comment.commentReText="回复@"+comment.name+" :";
  comment.reShow=!comment.reShow?true:false;
}

//所以需要$http,$scope 的公共函数写在下面，统一传入angularjs作用域内容
topic.angular=function($http,$scope,myName,selfName){
	var $http=$http,
			$scope=$scope,
			myName=myName,
			selfName=selfName;
	var openMyTopic=true;

	//分页
	var getMorePage=0;

	return {
		//初始化
		havemyTopic:function(){
		  this.getAboutTopic(myName,10,0);
		},
		//初始化
		init:function(){
			var _this=this;
		  //点击评论,获取评论
		  $scope.comAboutTopic=function(myTopic,e){
		    topic.commentTopic(myTopic,e,function(){
		      //评论大于0 并且第一次打开
		      _this.getComment(myTopic.uid,10,0,function(data){
		        //这里需要后台过滤数据内容--双层嵌套
		        myTopic.comlist=data.data;
		      });
		    });
		  }

		  //展开回复评论
		  $scope.comAboutReShow=function(comment){
		    topic.comRe(comment);
		  }

		  //提交话题评论
		  $scope.submitComAboutTopic=function(e,myTopic){
		    if(myTopic.topicCommentText==""){
		      alert("请填写评价");
		    }else{
		      var commentObj=topic.textExtract(myTopic.topicCommentText,selfName);
		      commentObj.pid=myTopic.uid;
		      if(myTopic.ifForward){
		        //是转发
		        //处理转发数据
		        _this.forwordObj(commentObj,myTopic);

		        //post数据和显示返回情况
		        _this.postComfor(commentObj,myTopic);
		      }else{
		        //不是转发
		        _this.postComNofor(commentObj,myTopic);
		      }
		    }
		  }

		  //提交回复评论
		  $scope.comAboutRe=function(comment,myTopic){
		    var noText="回复@"+comment.name+" :";
		    if(comment.commentReText==noText){
		    	alert("请填写回复");
		    }else{
			    var commentObj=topic.textExtract(comment.commentReText,selfName);
			    commentObj.pid=myTopic.uid;
			    if(myTopic.ifForwardRe){
			      //是转发
			      //处理转发数据
		        _this.forwordObj(commentObj,myTopic,comment);
			      //post数据和显示返回情况
			      _this.postComfor(commentObj,myTopic,comment);

			    }else{
			    	//不是转发
		        _this.postComNofor(commentObj,myTopic,comment);
			    }
		    }
		  }

		  //加载更多
		  $scope.getAboutMore=function(){
		  	_this.getAboutTopic(myName,10,getMorePage*10);
		  }
		},
		//加载我的话题函数
		getAboutTopic:function(name,pageSize,pageNum){
			$http({method: "GET", url: "/aboutTopic?name="+name+"&pageNum="+pageNum+"&pageSize="+pageSize}).
			  success(function(data,status){
			    if(data.isOk){
			      openMyTopic=false;
			      
			      getMorePage++;
			      
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
  	},
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
  	postComfor:function(commentObj,myTopic,comment){
  		$http.post("/submitCommentTopic", commentObj).
        success(function(data,status){
          if(data.isok){

            //在我的话题栏目展示刚刚转发内容
            if(!!$scope.myTopicList){
            	$scope.myTopicList.unshift(data.topic.data[0]);
            }

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
  	},
  	//处理转发数据
  	forwordObj:function(commentObj,myTopic,comment){
  		//是转发
      commentObj.isForward=true;
      commentObj.forwardObj={
        topic:myTopic.topic,
        time:myTopic.time,
        name:myTopic.name
      }

      if(myTopic.isForward){
      	//存在转发内容，需要组合
      	comment?commentObj.topic=comment.commentReText+"//@"+comment.name+" :"+comment.topic+"//@"+myTopic.name+" :"+myTopic.topic:commentObj.topic=commentObj.topic+"//@"+myTopic.forwardObj.name+":"+myTopic.forwardObj.topic;
      }else{
      	comment?commentObj.topic=comment.commentReText+"//@"+comment.name+" :"+comment.topic+"//@"+myTopic.name+" :"+myTopic.topic:commentObj.topic=commentObj.topic;
      }
  	}
	}
};