angular.module('App', []);

function FetchCtrl($scope, $http, $templateCache) {
  //显示是否关注
  $scope.isWatch=$("#iswatch").text();

  //通过url获取代码
  var pathUrl = /sh[0-9]{6}|sz[0-9]{6}/.exec(location.pathname);
  var watchUrl,userName;
  //绑定事件
  $scope.watchStock = function(name) {
      watchUrl="watchStock?uid="+pathUrl+"&name="+userName+"&beWatch="+$("#headShowName").text()+"&add=1";
      $http({method: "GET", url: watchUrl, cache: $templateCache}).
        success(function(data, status) {
          $scope.status = status;
          if(data.ok){
            $scope.isWatch="true";//显示取消
          }
        }).
        error(function(data, status) {
          $scope.data = data || "Request failed";
          $scope.status = status;
      });
  }

  $scope.unWatchStock=function(name){
    watchUrl="watchStock?uid="+pathUrl+"&name="+userName+"&beWatch="+$("#headShowName").text()+"&add=0";
    $http({method: "GET", url: watchUrl, cache: $templateCache}).
        success(function(data, status) {
          $scope.status = status;
          if(data.ok){
            $scope.isWatch="false";//显示关注
          }
        })
  }

  //监听自定义事件
  $('#iswatch').on('loginWatch', function(event, info) {
    $scope.isWatch="false";
    for(var i=0,l=info.length;i<l;i++){
      if(pathUrl==info[i]){
        $scope.isWatch="true";
      }
    }
  });

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
      }).
      error(function(data, status) {
        $scope.data = data || "Request failed";
        $scope.status = status;
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

//   // return{
//   //   init:function(){
//   //     this.watchStock()
//   //   },
//   //   //关注stock
//   //   watchStock:function(){
//   //     $("#watchStock").on("click",function(){

//   //     });
//   //   }
//   // }

// })();