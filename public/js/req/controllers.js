requirejs.config({
  //默认相对"js/lib"解析模块ID
  baseUrl: '../js',
  //如果模块ID以"app"开始，会相对js/app目录解析，path config是相对 baseUrl 解析的，而且不用包含".js"，因为 path config 指向的可能是目录
  paths: {
    jquery: 'jquery-1.10.2.min',
    angular:'angular.min',
    angularRoute:'angular-route.min',
    bootstrap:'bootstrap',
    header:'req/header',
    app:'req/app',
    user:'req/factory/user',
    watchAndFens:'req/factory/watchAndFens',
    textExtract:'req/factory/textExtract',
    topic:'req/factory/topic',
    index:'req/index'
  },
  shim: {
    'angular': {exports: 'angular'},
    'angularRoute' : {deps:['angular']},
  }
});

requirejs(['jquery','angular','angularRoute','bootstrap','header','app','index'],function ($,angular,angularRoute,bootstrap,header,app,indexCtrl) {
  //顶部作用域
  app.controller('allCtrl', function ($scope){
    $scope.$on("loginIn",function (event,msg) {
      $scope.$broadcast("loginInok", msg);
    });
  });

  //路由
  app.config(function($routeProvider) {
    $routeProvider.when('/index', {
      templateUrl: 'app/index.html'
      controller:indexCtrl
    });
    // $routeProvider.when('/login', {
    //   templateUrl: 'app/login.html',
    //   controller:loginCtrl
    // });
    // $routeProvider.when('/stock/:uid', {
    //   templateUrl: 'app/stock.html',
    //   controller:stockCtrl
    // });
    // $routeProvider.when('/people/:name', {
    //   templateUrl: 'app/people.html',
    //   controller:peopleCtrl
    // });
    // $routeProvider.when('/setting', {
    //   templateUrl: 'app/setting.html',
    //   controller:settingCtrl
    // });
  });


});












