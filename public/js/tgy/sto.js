angular.module('App', []);

function FetchCtrl($scope, $http, $templateCache) {
  //通过url获取代码
  var pathUrl = /sh[0-9]{6}|sz[0-9]{6}/.exec(location.pathname)
  
  $scope.method = 'JSONP';
  $scope.url = 'http://xueqiu.com/stock/quote.json?code='+pathUrl+'&callback=JSON_CALLBACK';
  //$scope.fetch = function() {
    $scope.code = null;
    $scope.response = null;

    function ajaxData(){
      $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
        success(function(data, status) {
          $scope.status = status;
          //数据处理
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
          setTimeout(start,5000);
       }
    }
    start();
}