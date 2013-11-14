angular.module('App', []);

function FetchCtrl($scope, $http, $templateCache) {

  
  
  $scope.method = 'JSONP';
  $scope.url = 'http://xueqiu.com/stock/quote.json?code=SH600171&callback=JSON_CALLBACK';
  //$scope.fetch = function() {
    $scope.code = null;
    $scope.response = null;

    $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
      success(function(data, status) {
        $scope.status = status;
        $scope.stock = data.quotes[0];
      }).
      error(function(data, status) {
        $scope.data = data || "Request failed";
        $scope.status = status;
    });
  //};


  //jquery接口
  // $.getJSON("http://xueqiu.com/stock/quote.json?code=SH600171&callback=?",
  // // {
  // //   code: "SH600171"
  // // },
  // function(data) {
  //   var l;
  // });



  // $scope.updateModel = function(method, url) {
  //   $scope.method = method;
  //   $scope.url = url;
  // };
}