var ngRoute=angular.module('ngView', ['ngRoute']);

ngRoute.config(function($routeProvider) {
  $routeProvider.when('/index', {
    templateUrl: 'app/index.html'
  });
  $routeProvider.when('/login', {
    templateUrl: 'app/login.html',
    controller:loginCtrl
  });
  $routeProvider.when('/stock', {
    templateUrl: 'app/stock.html'
  });
  $routeProvider.when('/people', {
    templateUrl: 'app/people.html'
  });
  $routeProvider.when('/setting/:name', {
    templateUrl: 'app/setting.html',
    controller:settingCtrl
  });
});

function IndexCtrl($scope, $http, $templateCache) {

}

function loginCtrl($scope, $http, $templateCache){
  $scope.formShow=true;
  $scope.toggle=function(){
    if($scope.formShow==true){
      $scope.formShow=false;
    }else{
      $scope.formShow=true;
    }
    
  }
}

function settingCtrl($scope, $routeParams) {
  $scope.name = $routeParams.name;
  

}