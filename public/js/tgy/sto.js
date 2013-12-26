angular.module('App', []);

function FetchCtrl($scope, $http, $templateCache) {
  //用户名
  var myName=$("#headShowName").text();
  var stockName;//股名字
  var sayComText;//默认评论内容
  
  //历史聊天记录
  var historyNum=0;
  var historyCache=20;
  //显示是否关注
  //$scope.isWatch=$("#iswatch").text();

  if($("#iswatch").text()=="false"){
    $("#butIswatch").show();
    $("#butNowatch").hide();
  }else{
    $("#butIswatch").hide();
    $("#butNowatch").show();
  }

  //通过url获取代码
  var pathUrl = /sh[0-9]{6}|sz[0-9]{6}/i.exec(location.pathname);
  //统一为小写模式
  pathUrl=pathUrl[0].toLowerCase();
  var watchUrl,userName;
  //绑定事件
  $scope.watchStock = function(name) {
    if($("#headShowName").attr("login")=="in"){
      watchUrl="watchStock?uid="+pathUrl+"&name="+userName+"&beWatchName="+$("#headShowName").text()+"&beWatchTop="+$("#headShowName").attr("top")+"&add=1";
      $http({method: "GET", url: watchUrl, cache: $templateCache}).
        success(function(data, status) {
          $scope.status = status;
          if(data.ok){
            //$scope.isWatch=true;//显示取消
            $("#butIswatch").hide();
            $("#butNowatch").show();
          }
        });
    }else{
      alert("请先登录");
    }
  };

  $scope.unWatchStock=function(name){
    if($("#headShowName").attr("login")=="in"){
      watchUrl="watchStock?uid="+pathUrl+"&name="+userName+"&beWatchName="+$("#headShowName").text()+"&beWatchTop="+$("#headShowName").attr("top")+"&add=0";
      $http({method: "GET", url: watchUrl, cache: $templateCache}).
        success(function(data, status) {
          $scope.status = status;
          if(data.ok){
            //$scope.isWatch=false;//显示关注
            $("#butIswatch").show();
            $("#butNowatch").hide();
          }
        });
    }else{
      alert("请先登录");
    }
  };

  //监听自定义事件
  $('#iswatch').on('loginWatch', function(event, info) {
    $("#butIswatch").show();
    $("#butNowatch").hide();
    for(var i=0,l=info.length;i<l;i++){
      if(pathUrl==info[i]){
        //$scope.isWatch="true";
        $("#butIswatch").hide();
        $("#butNowatch").show();
      }
    }
  });

  //获取相关的用户
  var aboutName;
  var aboutNamePage=0;
  var aboutNamePageSize=5;//每页人数
  var adoutLength;
  var adoutArrage=[];//用户分组
  $http({method: "GET", url: "stockAboutName?uid="+pathUrl, cache: $templateCache}).
    success(function(data, status) {
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

  //定时获取实时数据
  $scope.method = 'JSONP';
  $scope.url = 'http://xueqiu.com/stock/quote.json?code='+pathUrl+'&access_token=gbQtYjUWioQ9DQWGpDIREK&_=1386664413850&callback=JSON_CALLBACK';
  $scope.code = null;
  $scope.response = null;

  function ajaxData(callback){
    $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
      success(function(data, status) {
        $scope.status = status;
        //数据处理
        userName=data.quotes[0].name;
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

        if(callback){
          callback();
        }
      });
  }
  ajaxData(function(){
    //第一次加载完数据显示后执行
    //股名,这里为添加匹配股名
    stockName=$scope.stock.name;
    sayComText="("+pathUrl+")$"+stockName+"$ :";
    $scope.sayCom=sayComText;
    delay();
  });
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
    var myName=$("#headShowName").text();
    if($("#headShowName").text()===""){
      alert("登录后才能加入聊天室");
    }else{
      if(!$scope.addRoom){
        $scope.addRoom=true;
        chat.emit('add',{
          name:$("#headShowName").text(),
          stock:pathUrl,
          stockName:$("#stockName").attr("name")
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
    }
  };

  $scope.talkSubmit=function(){
    if(talkOpen){
      talkOpen=false;
      var talkText=$("#talkText").val();
      if(talkText===""){
        alert("请输入内容");
      }
      chat.emit('talk',{
        name:$("#headShowName").text(),
        room:pathUrl,
        text:talkText
        // stockName:$("#stockName").attr("name")
      },function(info){
        if(info.isok){
          //发送消息提交成功后清除输入框内容
          $("#talkText").val("");
          talkOpen=true;
        }
      });
    }
  };
  //查看聊天室早期内容
  $scope.lookTalkMessage=function(){
    //historyNum 有bug,当保存了少有historyCache 出现
    historyNum=parseInt($(".talkNum").length/historyCache);
    $http({method: "GET", url: "TalkHistory?stock="+pathUrl+"&num="+historyNum, cache: $templateCache}).
      success(function(data, status){
        historyNum++;
        if(data.ok){
          //有历史记录
          var historyHtml="";
          for(var i=0,l=data.history.length;i<l;i++){
            if(data.history[i].name==myName){
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

  /*
  发布评论
  */
  //提交话题
  $scope.submitCom=function(){
    var commentObj=stock.textExtract($scope.sayCom,myName);
    $http.post("/submitTopic", commentObj).
      success(function(data,status){
        if(data.isOk){
          $scope.sayCom=sayComText;
        }else{
          alert("提交失败!");
        }
      });
  };


  //下面是延迟执行的内容
  var delay=function(){
    /*
    下方讨论模块
    */
    var stockTopic=stock.angular($http,$scope,null,myName);
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
      this.getTopic(pathUrl,stockName,10,0);
      //加载更多-有差异
      $scope.getStockTopicMore=function(e){
        var num=Number($(e.target).attr("num"));
        _this.getTopic(pathUrl,stockName,10,num*10,$(e.target));
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
    stockTopic.init();
  };
}