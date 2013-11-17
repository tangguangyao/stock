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
  var pathUrl = /sh[0-9]{6}|sz[0-9]{6}/.exec(location.pathname);
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
      alert("请先登录")
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
  $http({method: "GET", url: "stockAboutName?uid="+pathUrl, cache: $templateCache}).
    success(function(data, status) {
      var l;
    });


  //定时获取实时数据
  $scope.method = 'JSONP';
  $scope.url = 'http://xueqiu.com/stock/quote.json?code='+pathUrl+'&callback=JSON_CALLBACK';
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

        if(data.quotes[0].current>data.quotes[0].last_close){
          data.quotes[0].zdClass="red";
          data.quotes[0].zdf="+";
        }else if(data.quotes[0].current=data.quotes[0].last_close){
          data.quotes[0].zdClass="";
          data.quotes[0].zdf="";
        }else{
          data.quotes[0].zdClass="green";
          data.quotes[0].zdf="-";
        }

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


// var stock=stock||{};

// stock.sto=(function(){

//   return{
//     init:function(){
//       this.loginWatch()
//     },
//     //关注stock
//     loginWatch:function(){
//       var _this=this;
//       $('#iswatch').on('loginWatch', function(event, info) {
//         _this.info=info;
//         $("#iswatch").click();
//         // $scope.isWatch="false";
//         // for(var i=0,l=info.length;i<l;i++){
//         //   if(pathUrl==info[i]){
//         //     $scope.isWatch="true";
//         //   }
//         // }
//       });
//     }
//   }

// })();

// stock.sto.init();