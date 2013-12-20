/*
可以统一适用于话题讨论
获取加载内容，外部定义
外部定义一些ng-click时间，需要定义不同名字，提交的内容可以使用一套接口，但是返回数据后，需要根据不同情况体现
展开评论，和展开回复都可以使用同一个函数
*/

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
	};
	return commentObj;
};

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
};

stock.comRe=function(comment){
	comment.commentReText="回复@"+comment.name+" :";
	comment.reShow=!comment.reShow?true:false;
};

//处理转发数据
stock.forwordObj=function(commentObj,myTopic,comment){
	//是转发
	commentObj.isForward=true;
	commentObj.forwardObj={
		topic:myTopic.topic,
		time:myTopic.time,
		name:myTopic.name
	};

	if(myTopic.isForward){
		//存在转发内容，需要组合
		if(comment){
			commentObj.topic=comment.commentReText+"//@"+comment.name+" :"+comment.topic+"//@"+myTopic.name+" :"+myTopic.topic;
		}else{
			commentObj.topic=commentObj.topic+"//@"+myTopic.forwardObj.name+":"+myTopic.forwardObj.topic;
		}
	}else{
		if(comment){
			commentObj.topic=comment.commentReText+"//@"+comment.name+" :"+comment.topic+"//@"+myTopic.name+" :"+myTopic.topic;
		}else{
			commentObj.topic=commentObj.topic;
		}
	}
};

//所以需要$http,$scope 的公共函数写在下面，统一传入angularjs作用域内容
stock.angular=function($http,$scope,myName,selfName){
	return {
		//初始化
		init:function(){
			var _this=this;
			//点击评论,获取评论-无差异
			$scope.commentTopic=function(myTopic,e){
				stock.commentTopic(myTopic,e,function(){
					//评论大于0 并且第一次打开
					_this.getComment(myTopic.uid,10,0,function(data){
						//这里需要后台过滤数据内容
						myTopic.comlist=data.data;
					});
				});
			};
			//展开回复评论-无差异
			$scope.comRe=function(comment){
				stock.comRe(comment);
			};
			//调用时自定义
			_this.clickNg();
		},
		//处理话题评论过程
		subComTop:function(e,myTopic,callback){
			var _this=this;
			if(myTopic.topicCommentText===""){
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
					this.postComNofor(commentObj,myTopic);
				}
			}
		},
		comRe:function(comment,myTopic,callback){
			var _this=this;
			var noText="回复@"+comment.name+" :";
			if(comment.commentReText==noText){
				alert("请填写回复");
			}else{
				var commentObj=stock.textExtract(comment.commentReText,selfName);
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
		//加载话题的评论
		getComment:function(uid,pageSize,pageNum,callback){
			$http({method: "GET", url: "/getComment?uid="+uid+"&pageNum="+pageNum+"&pageSize="+pageSize}).
				success(function(data,status){
					if(data.isOk){
						//$scope.myTopicList=data.data;
						callback(data);
					}else{
						alert("获取失败");
					}
				});
		},
		//回复评论，非转发
		postComNofor:function(commentObj,myTopic,comment){
			commentObj.isForward=false;
			$http.post("/submitCommentTopic", commentObj).
				success(function(data,status){
					if(data.isOk){
						//取消转发按键
						myTopic.ifForwardRe=false;

						if(comment){
							//隐藏回复框
							comment.reShow=false;
						}
						//成功后评论+1
						myTopic.comment++;
						//清空评论comment 不存在，清空话题评论，存在，清空评论的评论
						if(comment){
							comment.commentReText="";
						}else{
							myTopic.topicCommentText="";
						}
						//新加评论插入第一个
						var obj={
							name:data.data[0].name,
							time:data.data[0].time,
							topic:data.data[0].topic
						};
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
						//取消转发按键
						myTopic.ifForwardRe=false;

						if(comment){
							//隐藏回复框
							comment.reShow=false;
						}

						//回调出路是否展示
						callback(data.topic.data[0]);

						//处理评论
						//成功后评论+1,转发+1
						myTopic.comment++;
						myTopic.forward++;
						//清空评论
						if(comment){
							comment.commentReText="";
						}else{
							myTopic.topicCommentText="";
						}
						//新加评论插入第一个
						var obj={
							name:data.comment.data[0].name,
							time:data.comment.data[0].time,
							topic:data.comment.data[0].topic
						};
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
	};
};
