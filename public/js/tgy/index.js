angular.module('App', []);

function IndexCtrl($scope, $http, $templateCache) {
  //定时获取关注数据
  
  $scope.method = 'JSONP';
  var stockCode=$("#stockList").attr("my-stock");
  //$scope.url = 'http://xueqiu.com/stock/quote.json?code='+pathUrl+'&callback=JSON_CALLBACK';
  $scope.url = 'http://xueqiu.com/stock/quote.json?code='+stockCode+'&key=47bce5c74f&access_token=aZy51015GfDGsvsNtit2XY&_=1384782884165&callback=JSON_CALLBACK'
  $scope.code = null;
  $scope.response = null;

  function ajaxStock(){
    $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
      success(function(data, status) {
      	$scope.stocks=data.quotes;
        for(var i=0,l=data.quotes.length;i<l;i++){
          data.quotes[i].volume=(data.quotes[i].volume/10000).toFixed(2);
          data.quotes[i].marketCapital=(data.quotes[i].marketCapital/100000000).toFixed(2)
          if(Number(data.quotes[i].change)>0){
            data.quotes[i].zdClass="red";
            data.quotes[i].change="+"+data.quotes[i].change;
            data.quotes[i].percentage="+"+data.quotes[i].percentage+"%";
          }else if(Number(data.quotes[i].change)==0){
            data.quotes[i].zdClass="";
            data.quotes[i].percentage=data.quotes[i].percentage+"%";
          }else{
            data.quotes[i].zdClass="green";
            data.quotes[i].percentage=data.quotes[i].percentage+"%";
          }
        }
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


  //绑定事件
  $scope.delStock = function(stock) {
    var stockUid=stock.symbol.toLocaleLowerCase();
    var watchUrl="watchStock?uid="+stockUid+"&name="+stock.name+"&beWatchName="+$("#headShowName").text()+"&beWatchTop="+$("#headShowName").attr("top")+"&add=0";
    $http({method: "GET", url: watchUrl, cache: $templateCache}).
      success(function(data, status) {
        var newlist=[];
        if(data.ok){
          for(var i=0,l=$scope.stocks.length;i<l;i++){
            if($scope.stocks[i].name!=stock.name){
              newlist.push($scope.stocks[i]);
            }
          }
          $scope.stocks=newlist;
        }else{
          alert("出错了");
        }
      });
  }


}