var app=angular.module('ngView', ['ngRoute']);

app.config(function($routeProvider) {
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

// app.controller('ngView', function ($scope, $http) {
//   $scope.resetLogin=function(){
//     alert(1);
//   }
// })

function IndexCtrl($scope, $http, $templateCache) {

}



function settingCtrl($scope, $routeParams) {
  $scope.name = $routeParams.name;
  

}