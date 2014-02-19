var app=angular.module('ngView', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.when('/index', {
    templateUrl: 'app/index.html',
    controller:indexCtrl
  });
  $routeProvider.when('/login', {
    templateUrl: 'app/login.html',
    controller:loginCtrl
  });
  $routeProvider.when('/stock', {
    templateUrl: 'app/stock.html'
  });
  $routeProvider.when('/people/:name', {
    templateUrl: 'app/people.html',
    controller:peopleCtrl
  });
  $routeProvider.when('/setting', {
    templateUrl: 'app/setting.html',
    controller:settingCtrl
  });
});

//顶部作用域
function allCtrl($scope){
  $scope.$on("loginIn",function (event,msg) {
    $scope.$broadcast("loginInok", msg);
  });
}


//全局身份验证
app.factory('User', [function() {
  User={
    set:function(info){
      this.info=info;
    },
    get:function(){
      return this.info;
    }
  }
  //验证是否登录（身份验证）,这里使用ajax同步请求，阻塞下js执行
  $.ajax({ type: "get", url: "/isOnline", async:false, success: function(data){ 
    if(data.ok){
      User.set(data.info)
    }
  }});
  return User;
}]);






















function settingCtrl($scope, $routeParams) {
  $scope.name = $routeParams.name;
}