angular.module('App', []);

function IndexCtrl($scope, $http, $templateCache) {
  //定时获取关注数据
  
  $scope.method = 'JSONP';
  var stockCode='SH600267,SZ002194,SH600171';
  //$scope.url = 'http://xueqiu.com/stock/quote.json?code='+pathUrl+'&callback=JSON_CALLBACK';
  $scope.url = 'http://xueqiu.com/stock/quote.json?code='+stockCode+'&key=47bce5c74f&access_token=aZy51015GfDGsvsNtit2XY&_=1384782884165&callback=JSON_CALLBACK'
  $scope.code = null;
  $scope.response = null;

  function ajaxStock(){
    $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
      success(function(data, status) {
      	$scope.stocks=data.quotes;
        // $scope.status = status;
        // //数据处理
        // userName=data.quotes[0].name;
        // var time=new Date(data.quotes[0].time);
        // data.quotes[0].time=time.getTime();

        // if(data.quotes[0].current>data.quotes[0].last_close){
        //   data.quotes[0].zdClass="red";
        //   data.quotes[0].zdf="+";
        // }else if(data.quotes[0].current=data.quotes[0].last_close){
        //   data.quotes[0].zdClass="";
        //   data.quotes[0].zdf="";
        // }else{
        //   data.quotes[0].zdClass="green";
        //   data.quotes[0].zdf="-";
        // }

        // $scope.stock = data.quotes[0];
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
  //start();
}