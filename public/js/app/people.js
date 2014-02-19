function peopleCtrl($scope, $routeParams, $http, $location ,User){
	$scope.userInfo=User.get();
	if(!$scope.userInfo){
		$location.path("/login");
		return;
	}else{
		$scope.$emit("loginIn", $scope.userInfo);
	}


	var lookName=$scope.name=$routeParams.name;
	$scope.myself=false;
	$http({method: "GET", url: "/peopleAjax?name="+lookName}).success(function(data,status){
		data.user.info.pic.big="/images/"+data.user.info.pic.big;
		$scope.people=data.user;
		if(data.isWatch=="myself"){
			$scope.myself=true;
		}else{
			$scope.iswatch=data.isWatch;
		}
	});
}

function timeStock($scope, $http){
	//股票实时数据
	var userInfo=$scope.$parent.userInfo;
	var time;
	function ajaxStock(){
	    stockCode=userInfo.stock.join(",");
	    //$scope.url = 'http://xueqiu.com/stock/quote.json?code='+pathUrl+'&callback=JSON_CALLBACK';
	    if(stockCode!==""){
	      //如果没有信息，就不请求
	      $scope.url = 'http://xueqiu.com/stock/quote.json?code='+stockCode+'&'+xueqiuUrl+'&callback=JSON_CALLBACK';
	      $http({ method: "JSONP", url: $scope.url }).success(function(data, status) {
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
	}
	ajaxStock();
	var hours;
	var now;
	function start(){
		now = new Date();
		hours = now.getHours();
		if(hours>9&&hours<20){
			ajaxStock();
			time=setTimeout(start,10000);
		}
	}
	start();

	//路由跳转后暂停加载
	$scope.$on('$routeChangeStart', function(next, current) {
		clearTimeout(time);
	});
}

/*
话题模块
*/
function mytopic($scope, $http, topicFun){

  //初始化stock.angular函数，传入这个作用域内需要用到的函数
  //var selfName=myName;//selfName登陆用户
  var openMyTopic=true;
  var myName=$scope.$parent.name;
  var selfName=$scope.$parent.userInfo.name;
  var angular=topicFun.angular($http,$scope,myName,selfName);
  //自定义加载内容
  angular.getMyTopic=function(url,name,pageSize,pageNum,event){
    $http({method: "GET", url: "/"+url+"?name="+name+"&pageNum="+pageNum+"&pageSize="+pageSize}).
      success(function(data,status){
        if(data.isOk){
          openMyTopic=false;
          //处理分页
          if(event){
            event.attr("num",pageNum/10+1);
          }       
          if(pageNum===0){
            $scope.myTopicList=data.data;
          }else{
            $scope.myTopicList=$scope.myTopicList.concat(data.data);
          }
          
          //超过10条显示加载跟多
          if(data.data.length==10){
            $scope.myTopicGetmore=true;
          }else{
            $scope.myTopicGetmore=false;
          }
        }else{
          alert("获取失败");
        }
      });
  };
  //有差异处理的ng-click
  angular.clickNg=function(){
    var _this=this;
    //初始化我的话题
    _this.getMyTopic("myTopic",myName,10,0);

    //提交话题评论-回调有差异
    $scope.submitCommentTopic=function(e,myTopic){
      _this.subComTop(e,myTopic,function(data){
        //展示刚刚转发内容
        if(myName==selfName){
          $scope.myTopicList.unshift(data);
        }
      });
    };

    //提交回复评论-回调有差异
    $scope.commentRe=function(comment,myTopic){
      _this.comRe(comment,myTopic,function(data){
        //展示刚刚转发内容
        if(myName==selfName){
          $scope.myTopicList.unshift(data);
        }
      });
    };
    //加载更多-有差异
    $scope.getTopicMore=function(e){
      var num=Number($(e.target).attr("num"));
      _this.getMyTopic("myTopic",myName,10,num*10,$(e.target));
    };
  };
  //初始化我的话题
  angular.init();
}