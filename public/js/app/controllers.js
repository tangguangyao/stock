var routeApp = angular.module('routeApp',[]);
routeApp.config(['$routeProvider',function ($routeProvider) {
      $routeProvider
      .when('/index', {
        templateUrl: 'index.html',
        controller: 'RouteIndexCtl'
      })
      .when('/login', {
          templateUrl: 'login.html',
          controller: 'RouteLoginCtl'
      })
      // .otherwise({
      //   redirectTo: '/index'
      // });
}]);