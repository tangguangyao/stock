angular.module('App', []);

function peopleCtrl($scope, $http, $templateCache){
  var selfName=$("#headShowName").text();
  //加载时判断是否已经关注了该用户，这里用jquery处理，angular处理有点坑
  var ifWatch=$("#watchP").attr("isWatch");
  if(ifWatch=="true"){
    $("#watchOk").hide();
    $("#watchNo").show();
  }else if(ifWatch=="false"){
    $("#watchOk").show();
    $("#watchNo").hide();
  }else{
    //如果是本人页面
    $("#watchP").hide();
  }

	//关注用户
	var myName=$("#pageName").attr("pName");
  $scope.watchPeo=function(){
    $http({method: "GET", url: "/watchPeople?name="+myName, cache: $templateCache}).
      success(function(data,status){
        if(data.ok){
          $("#watchOk").hide();
          $("#watchNo").show();
        }else{
          $("#watchOk").hide();
          $("#watchNo").show();
          alert(data.message);
        }
      });
  }

  $scope.unwatchPeo=function(){
    $http({method: "GET", url: "/unwatchPeople?name="+myName, cache: $templateCache}).
      success(function(data,status){
        if(data.ok){
          $("#watchOk").show();
          $("#watchNo").hide();
        }
      });
  }

	//股票实时数据
	function ajaxStock(){
		$scope.method = 'JSONP';
    stockCode=$("#stockList").attr("my-stock");
    //$scope.url = 'http://xueqiu.com/stock/quote.json?code='+pathUrl+'&callback=JSON_CALLBACK';
    if(stockCode==""){
      //如果没有信息，就不请求
      return;
    }
    $scope.url = 'http://xueqiu.com/stock/quote.json?code='+stockCode+'&key=47bce5c74f&access_token=gbQtYjUWioQ9DQWGpDIREK&_=1386664870607&callback=JSON_CALLBACK';
    $scope.code = null;
    $scope.response = null;
    $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
      success(function(data, status) {
        for(var i=0,l=data.quotes.length;i<l;i++){
          data.quotes[i].volume=(data.quotes[i].volume/10000).toFixed(2);
          data.quotes[i].marketCapital=(data.quotes[i].marketCapital/100000000).toFixed(2)
          if(Number(data.quotes[i].change)>0){
            data.quotes[i].zdClass="red";
            data.quotes[i].zdBack="danger";
            data.quotes[i].change="+"+data.quotes[i].change;
            data.quotes[i].percentage="+"+data.quotes[i].percentage+"%";
          }else if(Number(data.quotes[i].change)==0){
            data.quotes[i].zdClass="";
            data.quotes[i].zdBack="";
            data.quotes[i].percentage=data.quotes[i].percentage+"%";
          }else{
            data.quotes[i].zdClass="green";
            data.quotes[i].zdBack="success";
            data.quotes[i].percentage=data.quotes[i].percentage+"%";
          }
        }
        $scope.stocks=watchList=data.quotes;
      });
	}
	ajaxStock();
  var hours;
  var now;
  function start(){
     now = new Date();
     hours = now.getHours();
     if(hours>9&&hours<15){
        ajaxStock();
        setTimeout(start,10000);
     }
  }

  //展示关注的用户
  //没做分页效果
  $scope.watchTab=function(){
    var pageNum=0;
    var pageSize=10;
    var name=$("#pageName").attr("pname");
    $http({method: "GET", url: "/peopleWatchTab?name="+name+"&pageNum="+pageNum+"&pageSize="+pageSize, cache: $templateCache}).
      success(function(data,status){
        if(data.ok){
          watchAndFens(data.list);
          $scope.looks=data.list;
        }
      });
  }

  //展示粉丝
  $scope.fensTab=function(){
    var pageNum2=0;
    var pageSize2=10;
    var name=$("#pageName").attr("pname");
    $http({method: "GET", url: "/peopleFensTab?name="+name+"&pageNum="+pageNum2+"&pageSize="+pageSize2, cache: $templateCache}).
      success(function(data,status){
        if(data.ok){
          watchAndFens(data.list);
          $scope.fens=data.list;
        }
      });
  }


  /*
  公用函数
  */
  //处理关注和粉丝的数据
  var watchAndFens=function(data){
    for(var i=0,l=data.length;i<l;i++){
      if(data[i].myself){
        data[i].watch=false;
        data[i].unwatch=false;
      }else{
        if(data[i].haveWatch){//false表示没有关注
          data[i].watch=false;
          data[i].unwatch=true;
        }else{
          data[i].watch=true;
          data[i].unwatch=false;
        }
      }
    }
  }




  /*
  话题模块
  */
  //初始化stock.angular函数，传入这个作用域内需要用到的函数
  var angular=stock.angular($http,$scope);

  //获取被访问的话题
  angular.getMyTopic(myName,10,0);


  /*
  评论模块
  */

  //点击评论,获取评论
  $scope.commentTopic=function(myTopic,e){
    var thisTopicComment=$(e.target).parent().parent().next();
    if(thisTopicComment.attr("data-open")=="close"){
      thisTopicComment.show().attr("data-open","open");
      if(myTopic.comment>0 && thisTopicComment.attr("data-first")=="yes"){
        //评论大于0 并且第一次打开
        getComment(myTopic.uid,10,0,function(data){
          thisTopicComment.attr("data-first","no");
          //双层嵌套
          myTopic.comlist=data.data;
        });
      }
    }else{
      thisTopicComment.hide().attr("data-open","close");
    }
  }

  //加载话题的评论
  function getComment(uid,pageSize,pageNum,callback){
    $http({method: "GET", url: "/getComment?uid="+uid+"&pageNum="+pageNum+"&pageSize="+pageSize, cache: $templateCache}).
      success(function(data,status){
        if(data.isOk){
          //$scope.myTopicList=data.data;
          callback(data);
        }else{
          alert("获取失败")
        }
      });
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
              myTopicList.unshift(data.topic.data[0]);
              //刷新我的评论内容
              $scope.myTopicList=myTopicList;

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

  //展开回复评论
  $scope.comRe=function(e,myTopic,comment){
    //赋值一次
    var onlyOne=0;
    if(onlyOne==0){
      comment.commentReText="回复@"+comment.name+" :";
      onlyOne++;
    }
    
    var thisComRe=$(e.target).next().next();
    if(thisComRe.attr("show")=="false"){
      thisComRe.show().attr("show","true");
    }else{
      thisComRe.hide().attr("show","false");
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
            //展示刚刚转发内容
            myTopicList.unshift(data.topic.data[0]);
            //刷新我的评论内容
            $scope.myTopicList=myTopicList;

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

};