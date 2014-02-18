//index页面父控制器
function indexCtrl ($scope, $http, $location ,User) {
	$scope.userInfo=User.get();
	if(!$scope.userInfo){
		$location.path("/login");
		return;
	}else{
		$scope.$emit("loginIn", $scope.userInfo);
	}

}

//定时刷新控制器
function timeStock($scope, $http) {
	var userInfo=$scope.$parent.userInfo;
	if(!userInfo){
		//$location.path("/login");
		return;
	}
	function ajaxStock(){
		var stockCode=userInfo.stock.join(",");
		$scope.url = 'http://xueqiu.com/stock/quote.json?code='+stockCode+'&'+xueqiuUrl+'&callback=JSON_CALLBACK';
		$http({method: 'JSONP', url: $scope.url}).success(function(data, status) {
			for(var i=0,l=data.quotes.length;i<l;i++){
	      data.quotes[i].volume=(data.quotes[i].volume/10000).toFixed(2);
	      data.quotes[i].marketCapital=(data.quotes[i].marketCapital/100000000).toFixed(2);
	      if(Number(data.quotes[i].change)>0){
	        data.quotes[i].zdClass="red";
	        data.quotes[i].zdBack="danger";
	        data.quotes[i].change="+"+data.quotes[i].change;
	        data.quotes[i].percentage="+"+data.quotes[i].percentage+"%";
	      }else if(Number(data.quotes[i].change)===0){
	        data.quotes[i].zdClass="";
	        data.quotes[i].zdBack="";
	        data.quotes[i].percentage=data.quotes[i].percentage+"%";
	      }else{
	        data.quotes[i].zdClass="green";
	        data.quotes[i].zdBack="success";
	        data.quotes[i].percentage=data.quotes[i].percentage+"%";
	      }
	    }
	    $scope.stocks=data.quotes;
		});
	}

	ajaxStock();
	function startGetStock(){
		var now = new Date();
	  hours = now.getHours();
	  if(hours>9&&hours<20){
	  	ajaxStock();
	    setTimeout(function(){
	      startGetStock();
	    },5000);
	  }
	}
	startGetStock();
}

//热门股票
function topStock($scope, $http){
	var userInfo=$scope.$parent.userInfo;
	$http({method: "GET", url: "/hotStock"}).success(function(data,status){
      if(data.ok){
        for(var k=0,l3=data.list.length;k<l3;k++){
          data.list[k].haveWatch=true;
          data.list[k].num=k;
        }
        var userWatchList=userInfo.stock;
        for(var i=0,l=userWatchList.length;i<l;i++){
          for(var j=0,l2=data.list.length;j<l2;j++){
            if(userWatchList[i]==data.list[j].uid){
              data.list[j].haveWatch=false;
            }
          }
        }
        $scope.topList=topList=data.list;
      }
    });
}

//热门人物
function topUser($scope, $http){
    $http({method: "GET", url: "/hotPeople"}).success(function(data,status){
	  if(data.ok){
	    for(var i=0,l=data.list.length;i<l;i++){
	      data.list[i].num=i;
	    }
	    $scope.peoples=data.list;
	  }
	});
}

//我的关注话题
function topic($scope, $http,topicFun){
  /*
  我关注的用户话题模块
  */
  var myName=$scope.$parent.userInfo.name;
  var selfName=$scope.$parent.userInfo.name;
  var adoutTopic=topicFun.angular($http,$scope,myName,selfName);
  adoutTopic.getAboutTopic=function(url,name,pageSize,pageNum,event){
    $http({method: "GET", url: "/"+url+"?name="+name+"&pageNum="+pageNum+"&pageSize="+pageSize}).success(function(data,status){
      if(data.isOk){
        //openMyTopic=false; 
        //处理分页
        if(event){
          event.attr("num",pageNum/10+1);
        }
        
        if(pageNum===0){
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
        alert("获取失败");
      }
    });
  };
  adoutTopic.clickNg=function(){
    var _this=this;
    this.getAboutTopic("aboutTopic",myName,10,0);
    //提交话题评论
    $scope.submitComAboutTopic=function(e,myTopic){
      _this.subComTop(e,myTopic,function(data){
        if(!!$scope.myTopicList){
          //在我的话题栏目展示刚刚转发内容
          $scope.myTopicList.unshift(data);
        }
      });
    };

    //提交回复评论
    $scope.comAboutRe=function(comment,myTopic){
      _this.comRe(comment,myTopic,function(data){
        if(!!$scope.myTopicList){
          //在我的话题栏目展示刚刚转发内容
          $scope.myTopicList.unshift(data);
        }
      });
    };
    //加载更多
    $scope.getAboutMore=function(e){
      var num=Number($(e.target).attr("num"));
      _this.getAboutTopic("aboutTopic",myName,10,num*10,$(e.target));
    };
  };
  //初始化
  adoutTopic.init();
}