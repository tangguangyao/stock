angular.module('App', []);

function FetchCtrl($scope, $http, $templateCache) {
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
      alert("请先登录")
    }
  }

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
  }

  // var test=document.getElementsById(test);
  // test.onclick=function(){
  //   $scope.isWatch="false";
  // }
  

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
  }

  //定时获取实时数据
  $scope.method = 'JSONP';
  //$scope.url = 'http://xueqiu.com/stock/quote.json?code='+pathUrl+'&callback=JSON_CALLBACK';
  $scope.url = 'http://xueqiu.com/stock/quote.json?code='+pathUrl+'&access_token=aZy51015GfDGsvsNtit2XY&_=1384756173203&callback=JSON_CALLBACK'
  $scope.code = null;
  $scope.response = null;

  function ajaxData(){
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
        }else if(change==0){
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

  //聊天室socket
  var chat = io.connect('/chat');
  var talkOpen=true;
  //为打开聊天室
  $scope.addRoom=false;
  //监听聊天室通话
  chat.on('showTalk',function(data){
    if(data.name==$("#headShowName").text()){
      $("#showTalkCom").append("<p class='myTalk'>"+data.text+"("+data.time+")</p>");
    }else{
      $("#showTalkCom").append("<p><span>"+data.name+"("+data.time+")</span>:"+data.text+"</p>");
    }
  });
  //加入聊天室
  //只有登录用户才能加入聊天室
  $scope.addTalk=function(){
    var myName=$("#headShowName").text();
    if($("#headShowName").text()==""){
      alert("登录后才能加入聊天室");
    }else{
      if(!$scope.addRoom){
        $scope.addRoom=true;
        chat.emit('add',{
          name:$("#headShowName").text(),
          stock:pathUrl
        },function(info){
          //先返回一批数据
          if(info.cache){
            //显示缓存数据
            var html="";
            for(var i=0,l=info.text.length;i<l;i++){
              if(info.text[i].name==myName){
                html+="<p class='myTalk'>"+info.text[i].text+"("+info.text[i].time+")</p>";
              }else{
                html+="<p><span>"+info.text[i].name+"("+info.text[i].time+")</span>:"+info.text[i].text+"</p>";
              }
            }
            $("#showTalkCom").append(html);
          }
        });
      }
    }
  }
  $scope.talkSubmit=function(){
    if(talkOpen){
      talkOpen=false;
      var talkText=$("#talkText").val();
      if(talkText==""){
        alert("请输入内容");
      }
      chat.emit('talk',{
        name:$("#headShowName").text(),
        room:pathUrl,
        text:talkText
      },function(info){
        if(info.isok){
          //发送消息提交成功后清除输入框内容
          $("#talkText").val("");
          talkOpen=true;
        }
      });
    }
  }
}