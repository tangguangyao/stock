var app=angular.module('ngView', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.when('/index', {
    templateUrl: 'app/index.html',
    controller:IndexCtrl
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


app.factory('User', [function() {
  User={
    set:function(info){
      this.info=info;
    },
    get:function(){
      return this.info;
    }
  }
  return User;
}]);




function settingCtrl($scope, $routeParams) {
  $scope.name = $routeParams.name;
  

}