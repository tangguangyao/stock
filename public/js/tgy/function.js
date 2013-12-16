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


//所以需要$http,$scope 的公共函数写在下面，统一传入angularjs作用域内容
stock.angular=function($http,$scope){
	var $http=$http,
		$scope=$scope;

	return {
		//加载我的话题函数
		getMyTopic:function(name,pageSize,pageNum){
			$http({method: "GET", url: "/myTopic?name="+name+"&pageNum="+pageNum+"&pageSize="+pageSize}).
			  success(function(data,status){
			    if(data.isOk){
			      openMyTopic=false;
			      $scope.myTopicList=myTopicList=data.data;
			    }else{
			      alert("获取失败")
			    }
			  });
		}
	}
};






//构造函数的话，需要修改this作用域，比较麻烦
// function Fun($http,$scope){
// 	this.$http=$http;
// 	this.$scope=$scope;
// }
// Fun.prototype={
// 	getMyTopic:function(name,pageSize,pageNum){
// 		var _this=this;
// 		this.$http({method: "GET", url: "/myTopic?name="+name+"&pageNum="+pageNum+"&pageSize="+pageSize}).
// 		  success(function(data,status){
// 		    if(data.isOk){
// 		      openMyTopic=false;
// 		      _this.$scope.myTopicList=myTopicList=data.data;
// 		    }else{
// 		      alert("获取失败")
// 		    }
// 		  });
// 	}
// }

