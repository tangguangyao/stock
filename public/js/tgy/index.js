angular.module('App', []);

function IndexCtrl($scope, $http, $templateCache) {
  var myName=$("#headShowName").text();
  //定时刷新列表
  var timeStock=[];
  //关注列表
  var watchList=[];
  //热门列表
  var topList=[];
  //清洗热门列表
  var newTopList=[];
  //新关注数据
  var newMyStock;
  //删除我的关注列表
  var newlist=[];
  //定时请求的列表
  var stockCode;
  //删除的股票uid和url
  var delStockUid;
  var delWatchUrl;
  //关注一个热门uid和url
  var topStockUid;
  var topWatchUrl
  //为了解决删除自选股，增加热门关注效果的ng-show问题
  var newArrtop=[];
  //判断第一次加载我的评论
  var openMyTopic=true;
  //储存我的话题过度数组
  var myTopicList;
  //储存话题的评论过度数组
  var commentList=[];


  //定时获取关注数据
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
  start();

  //请求热门股
  $http({method: "GET", url: "/hotStock", cache: $templateCache}).
    success(function(data,status){
      if(data.ok){
        for(var k=0,l3=data.list.length;k<l3;k++){
          data.list[k].haveWatch=true;
          data.list[k].num=k;
        }
        var userWatchList=$("#stockList").attr("my-stock").split(",");
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

  //请求热门用户
  //由于后端同时请求了热门股票，会导致mongodb同时开启导致bug，暂时注释
  var topPeopleList;
  $http({method: "GET", url: "/hotPeople", cache: $templateCache}).
    success(function(data,status){
      if(data.ok){
        for(var i=0,l=data.list.length;i<l;i++){
          data.list[i].num=i;
        }
        $scope.peoples=topPeopleList=data.list;
      }
    });

  //关注热门人物
  $scope.topPeople=function(people){
    var name=people.name;
    var num=people.num;
    if($("#headShowName").text()==name){
      alert("不能关注自己");
      return;
    }
    $http({method: "GET", url: "/watchPeople?name="+name, cache: $templateCache}).
      success(function(data,status){
        if(data.ok){
          var newArrayTop=[];
          for(var i=0,l=topPeopleList.length;i<l;i++){
            newArrayTop.push({
              num:topPeopleList[i].num,
              name:topPeopleList[i].name,
              top:topPeopleList[i].top,
              isWatch:topPeopleList[i].isWatch
            })
          }
          newArrayTop[num].isWatch=true;
          newArrayTop[num].top++;
          $scope.peoples=topPeopleList=newArrayTop;
        }
      });
  }

  //删除关注的股票
  $scope.delStock = function(stock) {
    delStockUid=stock.symbol.toLowerCase();
    delWatchUrl="watchStock?uid="+delStockUid+"&name="+stock.name+"&beWatchName="+$("#headShowName").text()+"&beWatchTop="+$("#headShowName").attr("top")+"&add=0";
    $http({method: "GET", url: delWatchUrl, cache: $templateCache}).
      success(function(data, status) {
        newlist=[];
        if(data.ok){
          for(var i=0,l=$scope.stocks.length;i<l;i++){
            if($scope.stocks[i].name!=stock.name){
              newlist.push($scope.stocks[i]);
            }
          }
          $scope.stocks=watchList=newlist;

          //在$("#stockList").attr("my-stock") 中减少删除数据,减少定时关注数据
          timeStock=$("#stockList").attr("my-stock").split(",");
          var newTimeStock=[];
          for(var i=0,l=timeStock.length;i<l;i++){
            if(timeStock[i]==delStockUid){
            }else{
              newTimeStock.push(timeStock[i]);
            }
          }
          timeStock=newTimeStock.join(",");
          $("#stockList").attr("my-stock",timeStock);

          for(var h=0,l5=topList.length;h<l5;h++){
            if(delStockUid==topList[h].uid){
              topList[h].haveWatch=true;
              topList[h].top--;
              newArrtop=[];
              for(var h=0,l6=topList.length;h<l6;h++){
                newArrtop.push({
                  uid:topList[h].uid,
                  name:topList[h].name,
                  top:topList[h].top,
                  haveWatch:topList[h].haveWatch,
                  num:topList[h].num
                })
              }
              $scope.topList=newArrtop;
              return;
            }
          }

          
        }else{
          alert("出错了");
        }
      });
  }

  //关注一个热门
  $scope.topWatch=function(list){
    topStockUid=list.uid.toLowerCase();
    topWatchUrl="watchStock?uid="+topStockUid+"&name="+list.name+"&beWatchName="+$("#headShowName").text()+"&beWatchTop="+$("#headShowName").attr("top")+"&add=1";
    $http({method: "GET", url: topWatchUrl, cache: $templateCache}).
      success(function(data, status) {
        if(data.ok){
          //刷新热门列表
          //清洗对象,angularjs不让$scope.topList直接改变重新赋值
          for(var m=0,l3=topList.length;m<l3;m++){
            newTopList[m]={
              haveWatch:topList[m].haveWatch,
              name:topList[m].name,
              top:topList[m].top,
              uid:topList[m].uid,
              num:topList[m].num
            }
          }
          newTopList[list.num].haveWatch=topList[list.num].haveWatch=false;
          //关注数增加1
          newTopList[list.num].top++;
          topList[list.num].top++;
          $scope.topList=newTopList;
          //刷新我的收藏
          $scope.addMethod = 'JSONP';
          $scope.addUrl = 'http://xueqiu.com/stock/quote.json?code='+topStockUid+'&access_token=aZy51015GfDGsvsNtit2XY&_=1384756173203&callback=JSON_CALLBACK';
          $http({method: $scope.addMethod, url: $scope.addUrl, cache: $templateCache}).
            success(function(data, status) {
              //请求关注的数据
              data.quotes[0].volume=(data.quotes[0].volume/10000).toFixed(2);
              data.quotes[0].marketCapital=(data.quotes[0].marketCapital/100000000).toFixed(2)
              if(Number(data.quotes[0].change)>0){
                data.quotes[0].zdClass="red";
                data.quotes[0].zdBack="danger";
                data.quotes[0].change="+"+data.quotes[0].change;
                data.quotes[0].percentage="+"+data.quotes[0].percentage+"%";
              }else if(Number(data.quotes[0].change)==0){
                data.quotes[0].zdClass="";
                data.quotes[0].zdBack="";
                data.quotes[0].percentage=data.quotes[0].percentage+"%";
              }else{
                data.quotes[0].zdClass="green";
                data.quotes[0].zdBack="success";
                data.quotes[0].percentage=data.quotes[0].percentage+"%";
              }
              watchList.push(data.quotes[0]);
              $scope.stocks=watchList;
              //在$("#stockList").attr("my-stock") 中增加更新,增加定时关注数据
              newMyStock=$("#stockList").attr("my-stock")+","+topStockUid;
              $("#stockList").attr("my-stock",newMyStock);
            });
        }else{
          alert("出错了");
        }
      });
  }

  //搜索股票
  $scope.search=function(){
    var searchUid=$("#stockUid").val();
    if(/^sh[0-9]{6}$|^sz[0-9]{6}$/i.test(searchUid)){
      location.href="stock/"+searchUid;
    }else{
      alert("请填写正确的代码");
    }
  }



  /*
  话题模块
  */
  //公共函数，提取评论信息
  var textExtract=function(comment){
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
      name:myName,
      aboutPeople:aboutPeople,
      aboutStockcode:aboutStockcode,
      aboutStockName:aboutStockName
    }
    return commentObj;
  }

  //提交话题
  $scope.submitCom=function(){
    var comment=$("#comment").val();
    var commentObj=textExtract(comment);
    $http.post("/submitTopic", commentObj).
      success(function(data,status){
        if(data.isOk){
          $("#comment").val("");
          if(!!$scope.myTopicList){
            //已经加载了我的评论页面
            //插入到第一个
            myTopicList.unshift(data.data[0]);
            //刷新我的评论内容
            $scope.myTopicList=myTopicList;
          }
        }else{
          alert("提交失败!");
        }
      });
  }

  //获取我的话题
  //初始化我的话题
  $scope.myTopic=function(){
    if(openMyTopic){
      getMyTopic(myName,10,0);
    }
  }

  //加载我的话题函数
  function getMyTopic(name,pageSize,pageNum){
    $http({method: "GET", url: "/myTopic?name="+name+"&pageNum="+pageNum+"&pageSize="+pageSize, cache: $templateCache}).
      success(function(data,status){
        if(data.isOk){
          openMyTopic=false;
          $scope.myTopicList=myTopicList=data.data;
        }else{
          alert("获取失败")
        }
      });
  }

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
          myTopic.comlist=commentList=data.data;
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
    var textComment=$(e.target).parent().parent().find(".topicCommentText").val();
    if(textComment==""){
      alert("请填写评价");
    }else{
      //判断是否转发
      var commentObj=textExtract(textComment);
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
              if(commentList.length>0){//存在就添加
                commentList.unshift(data.comment.data[0]);
              }else{//不存在,新建
                myTopic.comlist=commentList=data.comment.data;
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
              if(commentList.length>0){//存在就添加
                commentList.unshift(data.data[0]);
              }else{//不存在,新建
                myTopic.comlist=commentList=data.data;
              }
            }else{
              alert("提交失败!");
            }
          });
      }
    }
  }

  //回复评论
  $scope.comRe=function(e,myTopic){
    var thisComRe=$(e.target).next().next();
    if(thisComRe.attr("show")=="false"){
      thisComRe.show().attr("show","true");
    }else{
      thisComRe.hide().attr("show","false");
    }
  }
  
}