function stockCtrl($scope, $routeParams, $http, $location ,User,textExtract){
	$scope.userInfo=User.get();
	if(!$scope.userInfo){
		$location.path("/login");
		return;
	}else{
		$scope.$emit("loginIn", $scope.userInfo);
	}

	$scope.uid=$routeParams.uid.toLowerCase();
	$scope.myName=$scope.userInfo.name;


	$http({method: "GET", url: "/stockAjax/"+$scope.uid}).success(function(data,status){
		$scope.isWatch=data.isWatch;
		$scope.UserTop=data.user.top
	});

	$scope.watchStock = function(name) {
    //if($("#headShowName").attr("login")=="in"){
    	//watchStock?uid=sh600171&name=上海贝岭&beWatchName=tang&beWatchTop=2&add=1
      var watchUrl="watchStock?uid="+$scope.uid+"&name="+$scope.stockName+"&beWatchName="+$scope.myName+"&beWatchTop="+$scope.UserTop+"&add=1";
      $http({method: "GET", url: watchUrl}).success(function(data, status) {
        $scope.status = status;
        if(data.ok){
          $scope.isWatch=true;//显示取消
        }
      });
    // }else{
    //   alert("请先登录");
    // }
  };

  $scope.unWatchStock=function(name){
    // if($("#headShowName").attr("login")=="in"){
      var watchUrl="watchStock?uid="+$scope.uid+"&name="+$scope.stockName+"&beWatchName="+$scope.myName+"&beWatchTop="+$scope.UserTop+"&add=0";
      $http({method: "GET", url: watchUrl}).success(function(data, status) {
        $scope.status = status;
        if(data.ok){
          $scope.isWatch=false;//显示关注
        }
      });
    // }else{
    //   alert("请先登录");
    // }
  };

  //订阅消息
	$scope.$on("loadStockName",function (event,msg) {
    $scope.sayCom="("+msg+")$"+$scope.uid+"$: ";
    $scope.$broadcast("loadStockNameOk");
  });

  //提交话题
  $scope.submitCom=function(){
    var commentObj=textExtract($scope.sayCom,$scope.myName);
    $http.post("/submitTopic", commentObj).success(function(data,status){
      if(data.isOk){
        $scope.sayCom="("+$scope.stockName+")$"+$scope.uid+"$: ";
      }else{
        alert("提交失败!");
      }
    });
  };
}

function stockDetail($scope,$http){
	//定时获取实时数据
  var stockDetailUrl = 'http://xueqiu.com/stock/quote.json?code='+$scope.$parent.uid+'&'+xueqiuUrl+'&callback=JSON_CALLBACK';
  function ajaxData(){
    $http({method: 'JSONP', url: stockDetailUrl}).success(function(data, status) {
      $scope.status = status;
      //数据处理
      var userName=data.quotes[0].name;
      $scope.$parent.stockName=userName;

      $scope.$emit("loadStockName", userName);

      var time=new Date(data.quotes[0].time);
      data.quotes[0].time=time.getTime();

      var change=Number(data.quotes[0].change);

      if(change>0){
        data.quotes[0].zdClass="red";
        data.quotes[0].zdf="+";
      }else if(change===0){
        data.quotes[0].zdClass="";
        data.quotes[0].zdf="";
      }else{
        data.quotes[0].zdClass="green";
        data.quotes[0].zdf="";
      }
      data.quotes[0].volume=(data.quotes[0].volume/10000).toFixed(2);
      data.quotes[0].volumeAverage=(data.quotes[0].volumeAverage/10000).toFixed(2);
      data.quotes[0].amount=(data.quotes[0].amount/10000).toFixed(2);
      $scope.stock = data.quotes[0];
    });
  }
  ajaxData();
  var hours;
  var now;
  function start(){
     now = new Date();
     hours = now.getHours();
     if(hours>9&&hours<15){
        ajaxData();
        setTimeout(start,10000);
     }
  }
  start();
}

function stocktopic($scope,$http,topicFun){
	/*
  下方讨论模块
  */
  var stockTopic=topicFun.angular($http,$scope,null,$scope.$parent.myName);
  stockTopic.getTopic=function(uid,stockName,pageSize,pageNum,event){
    $http({method: "GET", url: "/stockTopic?uid="+uid+"&stockName="+stockName+"&pageNum="+pageNum+"&pageSize="+pageSize}).
      success(function(data,status){
        if(data.isOk){
          
          if(event){
            event.attr("num",pageNum/10+1);
          } 
          
          if(pageNum===0){
            $scope.stockTopicList=data.data;
          }else{
            $scope.stockTopicList=$scope.stockTopicList.concat(data.data);
          }
          
          //超过10条显示加载跟多
          if(data.data.length==10){
            $scope.stockTopicGetmore=true;
          }else{
            $scope.stockTopicGetmore=false;
          }
        }else{
          alert("获取失败");
        }
      });
  };
  stockTopic.clickNg=function(){
    var _this=this;
    //初始化我的话题
    this.getTopic($scope.$parent.uid,$scope.$parent.stockName,10,0);
    //加载更多-有差异
    $scope.getStockTopicMore=function(e){
      var num=Number($(e.target).attr("num"));
      _this.getTopic($scope.$parent.uid,$scope.$parent.stockName,10,num*10,$(e.target));
    };

    //提交话题评论-回调有差异
    $scope.submitComStockTopic=function(e,myTopic){
      _this.subComTop(e,myTopic,function(data){
        //不展示刚刚转发内容
      });
    };

    //提交回复评论-回调有差异
    $scope.comStockRe=function(comment,myTopic){
      _this.comRe(comment,myTopic,function(data){
        //不展示刚刚转发内容
      });
    };
  };
  //初始化
  $scope.$on("loadStockNameOk",function (event) {
  	stockTopic.init();
	})
}

function talkCtrl($scope,$http){
	//聊天室socket
  var chat = io.connect('/chat');
  var talkOpen=true;
  //为打开聊天室
  $scope.addRoom=false;
  //监听聊天室通话
  chat.on('showTalk',function(data){
    if(data.name==$("#headShowName").text()){
      $("#showTalkCom").append("<p class='myTalk talkNum'>"+data.text+"("+data.time+")</p>");
    }else{
      $("#showTalkCom").append("<p class='talkNum'><span>"+data.name+"("+data.time+")</span>:"+data.text+"</p>");
    }
  });
  //加入聊天室
  //只有登录用户才能加入聊天室
  $scope.addTalk=function(){
    // var myName=$("#headShowName").text();
    // if($("#headShowName").text()===""){
    //   alert("登录后才能加入聊天室");
    // }else{
      if(!$scope.addRoom){
        $scope.addRoom=true;
        chat.emit('add',{
          name:$scope.$parent.UserTop,
          stock:$scope.$parent.uid,
          stockName:$scope.$parent.stockName
        },function(info){
          //先返回一批数据
          if(info.cache){
            //显示缓存数据
            var html="";
            for(var i=0,l=info.text.length;i<l;i++){
              if(info.text[i].name==myName){
                html+="<p class='myTalk talkNum'>"+info.text[i].text+"("+info.text[i].time+")</p>";
              }else{
                html+="<p class='talkNum'><span>"+info.text[i].name+"("+info.text[i].time+")</span>:"+info.text[i].text+"</p>";
              }
            }
            $("#showTalkCom").append(html);
          }
        });
      }
    // }
  };

  //查看聊天室早期内容
  $scope.lookTalkMessage=function(){
  	var historyCache=20;
    //historyNum 有bug,当保存了少有historyCache 出现
    historyNum=parseInt($(".talkNum").length/historyCache);
    $http({method: "GET", url: "TalkHistory?stock="+$scope.$parent.uid+"&num="+historyNum}).success(function(data, status){
      historyNum++;
      if(data.ok){
        //有历史记录
        var historyHtml="";
        for(var i=0,l=data.history.length;i<l;i++){
          if(data.history[i].name==$scope.$parent.UserTop){
            historyHtml+="<p class='myTalk talkNum'>"+data.history[i].text+"("+data.history[i].time+")</p>";
          }else{
            historyHtml+="<p class='talkNum'><span>"+data.history[i].name+"("+data.history[i].time+")</span>:"+data.history[i].text+"</p>";
          }
        }
        $(".lookTalkMessage").after(historyHtml);
      }else{
        $(".lookTalkMessage").hide();
      }
    });
  };
}

function userWatchStock($scope,$http){
	//获取相关的用户
  var aboutName;
  var aboutNamePage=0;
  var aboutNamePageSize=5;//每页人数
  var adoutLength;
  var adoutArrage=[];//用户分组
  $http({method: "GET", url: "stockAboutName?uid="+$scope.$parent.uid}).success(function(data, status) {
    if(data.ok){
      $scope.haveAboutName=true;
      aboutName = data.info.beWatch;
      
      if(aboutName.length>aboutNamePageSize){
        $scope.change=true;
        aboutNamePage++;
        adoutLength=aboutNamePageSize;
      }else{
        adoutLength=aboutName.length;
        $scope.change=false;
      }
      var mAbout=[];
      for(var i=0;i<adoutLength;i++){
        mAbout.push(data.info.beWatch[i]);
      }
      $scope.adoutNames=mAbout;
      adoutArrage.push(mAbout);
    }else{
      $scope.haveAboutName=false;
    }
  });

  //换一批用户
  var newMabout,inum,newLength;
  $scope.changeAboutName=function(){
    newMabout=[];
    inum=aboutNamePage*aboutNamePageSize;
    // newLength=(aboutNamePage+1)*aboutNamePageSize<aboutName.length?(aboutNamePage+1)*aboutNamePageSize:aboutName.length;
    if((aboutNamePage+1)*aboutNamePageSize >= aboutName.length){
      newLength=aboutName.length;
      $scope.change=false;
    }else{
      newLength=(aboutNamePage+1)*aboutNamePageSize;
    }
    for(;inum<newLength;inum++){
      newMabout.push(aboutName[inum]);
      aboutNamePage++;
    }
    $scope.adoutNames=newMabout;
    adoutArrage.push(newMabout);
  };
}