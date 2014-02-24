define(["angular", "app","user","textExtract","topic"], function(angular, app) {
//index页面父控制器
return  indexCtrl=['$scope','$http','$location','$User','$textExtract',function($scope, $http, $location ,User,textExtract) {
// app.controller('indexCtrl', function ($scope, $http, $location ,User,textExtract){
	$scope.userInfo=User.get();
	if(!$scope.userInfo){
		$location.path("/login");
		return;
	}else{
		$scope.$emit("loginIn", $scope.userInfo);
	}

  //监听转发事件
  $scope.$on("forwardTopic",function (event,msg) {
    $scope.$broadcast("addMyTopic", msg);
  });

  //监听关注股票事件
  $scope.$on("addStockTime",function (event,msg) {
    $scope.$broadcast("refreshStockTime", msg);
  });

  //监听删除股票事件
  $scope.$on("delStockTime",function (event,msg) {
    $scope.$broadcast("delTopStock", msg);
  });

  $scope.submitCom=function(){
    if(!$scope.sayCom){
      alert("请填写内容");
    }else{
      var commentObj=textExtract($scope.sayCom,$scope.userInfo.name);
      $http.post("/submitTopic", commentObj).success(function(data,status){
        if(data.isOk){
          $scope.sayCom="";
          // if(!!$scope.myTopicList){//已经加载了我的评论页面
          //   //插入到第一个
          //   $scope.myTopicList.unshift(data.data[0]);
          // }
          $scope.$broadcast("addMyTopic", data.data[0]);
        }else{
          alert("提交失败!");
        }
      });
    }
  }
// });

}];

//定时刷新控制器
app.controller('timeStock', function ($scope, $http){
// function timeStock($scope, $http) {
	var userInfo=$scope.$parent.userInfo;
  var time;
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
	    time=setTimeout(function(){
	      startGetStock();
	    },5000);
	  }
	}
	startGetStock();

  //订阅股票刷新消息
  $scope.$on("refreshStockTime",function (event,msg) {
    userInfo.stock.push(msg.uid);
    ajaxStock();
  });

  //路由跳转后暂停加载
  $scope.$on('$routeChangeStart', function(next, current) {
    clearTimeout(time);
  });


  //删除股票
  $scope.delStock = function(Stock) {
    var delStockUid=Stock.symbol.toLowerCase();
    var delWatchUrl="watchStock?uid="+delStockUid+"&name="+Stock.name+"&beWatchName="+$("#headShowName").text()+"&beWatchTop="+$("#headShowName").attr("top")+"&add=0";
    $http({method: "GET", url: delWatchUrl}).success(function(data, status) {
      if(data.ok){

        //删除后，实时股票数据代码更新
        //$scope.stocks=stock.index.delStockTime($scope.stocks,Stock.name);
        var newlist=[];
        for(var i=0,l=$scope.stocks.length;i<l;i++){
          if($scope.stocks[i].name!=Stock.name){
            newlist.push($scope.stocks[i]);
          }
        }
        $scope.stocks=newlist;

        //在$("#stockList").attr("my-stock") 中减少删除数据,减少定时关注数据
        //stock.index.delStockList(delStockUid);
        var oldUserStock=$scope.$parent.userInfo.stock;
        var newUserStock=[];
        for(var i=0,l=oldUserStock.length;i<l;i++){
          if(oldUserStock[i]!==delStockUid){
            newUserStock.push(oldUserStock[i]);
          }
        }
        $scope.$parent.userInfo.stock=newUserStock;


        //热门股票处理,可能会有热门股票中包含已删除股票的内容
        // stock.index.delStockInTop(delStockUid,$scope.topList,function(newArrtop){
        //   $scope.topList=newArrtop;
        // });

        $scope.$emit("delStockTime", {uid:delStockUid});

      }else{
        alert("出错了");
      }
    });
  };
// }
});

//热门股票
app.controller('topStock', function ($scope, $http){
// function topStock($scope, $http){
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

  //关注一个热门股票，会显示到及时更新数据中
  $scope.topWatch=function(list){
    var topStockUid=list.uid.toLowerCase();
    var topWatchUrl="watchStock?uid="+topStockUid+"&name="+list.name+"&beWatchName="+$("#headShowName").text()+"&beWatchTop="+$("#headShowName").attr("top")+"&add=1";
    $http({method: "GET", url: topWatchUrl }).success(function(data, status) {
      if(data.ok){
        //刷新热门列表
        //$scope.topList=stock.index.addTopWatchList($scope.topList,list);
        var topList=$scope.topList;
        var newTopList=[];
        for(var m=0,l3=topList.length;m<l3;m++){
          newTopList[m]={
            haveWatch:topList[m].haveWatch,
            name:topList[m].name,
            top:topList[m].top,
            uid:topList[m].uid,
            num:topList[m].num
          };
        }
        newTopList[list.num].haveWatch=topList[list.num].haveWatch=false;
        //关注数增加1
        newTopList[list.num].top++;
        topList[list.num].top++;
        $scope.topList=newTopList;

        //发布更新消息
        $scope.$emit("addStockTime", {uid:topStockUid});
      }else{
        alert("出错了");
      }
    });
  };

  //订阅删除股票事件
  $scope.$on("delTopStock",function (event,msg) {
    //delStockUid,topList,callback
    var delStockUid=msg.uid;
    var topList=$scope.topList;
    for(var h=0,l5=topList.length;h<l5;h++){
      if(delStockUid==topList[h].uid){
        topList[h].haveWatch=true;
        topList[h].top--;
        newArrtop=[];
        for(var h2=0,l6=topList.length;h2<l6;h2++){
          newArrtop.push({
            uid:topList[h2].uid,
            name:topList[h2].name,
            top:topList[h2].top,
            haveWatch:topList[h2].haveWatch,
            num:topList[h2].num
          });
        }
        $scope.topList=newArrtop;
      }
    }
  });
// }
});

//热门人物
app.controller('topUser', function ($scope, $http){
// function topUser($scope, $http){
  $http({method: "GET", url: "/hotPeople"}).success(function(data,status){
	  if(data.ok){
	    for(var i=0,l=data.list.length;i<l;i++){
	      data.list[i].num=i;
	    }
	    $scope.peoples=data.list;
	  }
	});

  //关注热门人物
  $scope.topPeople=function(people){
    var name=people.name;
    var num=people.num;
    if($("#headShowName").text()==name){
      alert("不能关注自己");
    }else{
      $http({method: "GET", url: "/watchPeople?name="+name }).success(function(data,status){
        if(data.ok){
          //$scope.peoples=stock.index.watchTopPeopleData($scope.peoples,num);
          var newArrayTop=[];
          for(var i=0,l=$scope.peoples.length;i<l;i++){
            newArrayTop.push({
              num:$scope.peoples[i].num,
              name:$scope.peoples[i].name,
              top:$scope.peoples[i].top,
              isWatch:$scope.peoples[i].isWatch
            });
          }
          newArrayTop[num].isWatch=true;
          newArrayTop[num].top++;
          $scope.peoples=newArrayTop;
        }
      });
    }
  };
// }
});

/*
我关注的用户话题模块
*/
app.controller('topic', function ($scope, $http,topicFun){
// function topic($scope, $http,topicFun){
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
        // if(!!$scope.myTopicList){
        //   //在我的话题栏目展示刚刚转发内容
        //   $scope.myTopicList.unshift(data);
        // }
        //修改为控制器间的通信
        $scope.$emit("forwardTopic", data);
      });
    };

    //提交回复评论
    $scope.comAboutRe=function(comment,myTopic){
      _this.comRe(comment,myTopic,function(data){
        // if(!!$scope.myTopicList){
        //   //在我的话题栏目展示刚刚转发内容
        //   $scope.myTopicList.unshift(data);
        // }

        //修改为控制器间的通信
        $scope.$emit("forwardTopic", data);
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
// }
})

/*
我关注的股票话题模块
*/
app.controller('aboutstocktopic', function ($scope, $http,topicFun){
// function aboutstocktopic($scope, $http,topicFun){
  var myName=$scope.$parent.userInfo.name;
  var selfName=$scope.$parent.userInfo.name;
  var openAboutStockTopic=true;
  var adoutStockTopic=topicFun.angular($http,$scope,myName,selfName);
  adoutStockTopic.getAboutStockTopic=function(name,pageSize,pageNum,event){
    $http({method: "GET", url: "/aboutStockTopic?name="+name+"&pageNum="+pageNum+"&pageSize="+pageSize}).
      success(function(data,status){
        if(data.isOk){
          openAboutStockTopic=false; 
          //处理分页
          if(event){
            event.attr("num",pageNum/10+1);
          }
          
          if(pageNum===0){
            $scope.aboutStockTopicList=data.data;
          }else{
            $scope.aboutStockTopicList=$scope.aboutStockTopicList.concat(data.data);
          }
          
          //超过10条显示加载跟多
          if(data.data.length==10){
            $scope.aboutStockTopicMore=true;
          }else{
            $scope.aboutStockTopicMore=false;
          }
        }else{
          alert("获取失败");
        }
      });
  };
  adoutStockTopic.clickNg=function(){
    var _this=this;
    //点击初始化
    // $scope.aboutStockTopic=function(){
    //   if(openAboutStockTopic){
    //     _this.getAboutStockTopic(myName,10,0);
    //   }
    // };
    $("#aboutStockTopic").on("click",function(){
      if(openAboutStockTopic){
        _this.getAboutStockTopic(myName,10,0);
      }
    });
    //提交话题评论
    $scope.submitComAboutStockTopic=function(e,myTopic){
      _this.subComTop(e,myTopic,function(data){
        // if(!!$scope.myTopicList){
        //   //在我的话题栏目展示刚刚转发内容
        //   $scope.myTopicList.unshift(data);
        // }
        $scope.$emit("forwardTopic", data);
      });
    };

    //提交回复评论
    $scope.comAboutStockRe=function(comment,myTopic){
      _this.comRe(comment,myTopic,function(data){
        // if(!!$scope.myTopicList){
        //   //在我的话题栏目展示刚刚转发内容
        //   $scope.myTopicList.unshift(data);
        // }
        $scope.$emit("forwardTopic", data);
      });
    };

    //加载更多
    $scope.getStockTopicMore=function(e){
      var num=Number($(e.target).attr("num"));
      _this.getAboutStockTopic(myName,10,num*10,$(e.target));
    };
  };
  //初始化
  adoutStockTopic.init();
// }
});

/*
我的话题模块
*/
app.controller('mytopic', function ($scope, $http,topicFun){
// function mytopic($scope, $http, topicFun){
  //初始化stock.angular函数，传入这个作用域内需要用到的函数
  var myName=$scope.$parent.userInfo.name;
  var selfName=$scope.$parent.userInfo.name;
  var openMyTopic=true;
  var angular=topicFun.angular($http,$scope,myName,selfName);
  //自定义加载内容
  angular.getMyTopic=function(url,name,pageSize,pageNum,event){
    $http({method: "GET", url: "/"+url+"?name="+name+"&pageNum="+pageNum+"&pageSize="+pageSize}).success(function(data,status){
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
    // $scope.myTopic=function(){
    //   if(openMyTopic){
    //     _this.getMyTopic("myTopic",myName,10,0);
    //   }
    // };
    $("#myTopic").on("click",function(){
      if(openMyTopic){
        _this.getMyTopic("myTopic",myName,10,0);
      }
    });
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

  //订阅消息
  $scope.$on("addMyTopic",function (event,msg) {
    if(!!$scope.myTopicList){
      //在我的话题栏目展示刚刚转发内容
      $scope.myTopicList.unshift(msg);
    }
  });
// }
});

/*
@我话题模块
*/
app.controller('atmetopic', function ($scope, $http,topicFun){
//function atmetopic($scope, $http,topicFun){
  var myName=$scope.$parent.userInfo.name;
  var selfName=$scope.$parent.userInfo.name;
  var openAtmeTopic=true;
  var atmeTopic=topicFun.angular($http,$scope,myName,selfName);
  atmeTopic.getAtmeTopic=function(name,pageSize,pageNum,event){
    $http({method: "GET", url: "/atmeTopic?name="+name+"&pageNum="+pageNum+"&pageSize="+pageSize}).
      success(function(data,status){
        if(data.isOk){
          openAtmeTopic=false; 
          //处理分页
          if(event){
            event.attr("num",pageNum/10+1);
          }
          
          if(pageNum===0){
            $scope.atmeTopicList=data.data;
          }else{
            $scope.atmeTopicList=$scope.atmeTopicList.concat(data.data);
          }
          
          //超过10条显示加载跟多
          if(data.data.length==10){
            $scope.atmeTopicMore=true;
          }else{
            $scope.atmeTopicMore=false;
          }
        }else{
          alert("获取失败");
        }
      });
  };
  atmeTopic.clickNg=function(){
    var _this=this;
    //点击初始化
    // $scope.atTopic=function(){
    //   if(openAtmeTopic){
    //     _this.getAtmeTopic(myName,10,0);
    //   }
    // };
    $("#atTopic").on("click",function(){
      if(openAtmeTopic){
        _this.getAtmeTopic(myName,10,0);
      }
    });
    //提交话题评论
    $scope.submitComAtmeTopic=function(e,myTopic){
      _this.subComTop(e,myTopic,function(data){
        // if(!!$scope.myTopicList){
        //   //在我的话题栏目展示刚刚转发内容
        //   $scope.myTopicList.unshift(data);
        // }
        $scope.$emit("forwardTopic", data);
      });
    };

    //提交回复评论
    $scope.comAtmeRe=function(comment,myTopic){
      _this.comRe(comment,myTopic,function(data){
        // if(!!$scope.myTopicList){
        //   //在我的话题栏目展示刚刚转发内容
        //   $scope.myTopicList.unshift(data);
        // }
        $scope.$emit("forwardTopic", data);
      });
    };

    //加载更多
    $scope.getStockTopicMore=function(e){
      var num=Number($(e.target).attr("num"));
      _this.getAtmeTopic(myName,10,num*10,$(e.target));
    };
  };
  atmeTopic.init();
// }
});

});