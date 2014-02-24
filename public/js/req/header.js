define(["angular", "app","user"], function(angular, app) {

//顶部用户名显示

app.controller('headerCtrl', function ($scope,$http,$location,User){
  $scope.showPeople=false;

  $scope.ajaxLogin=false;
  $scope.nameLogin=false;
  
  var userInfo=User.get();
  if(userInfo){
    $scope.name=userInfo.name;
    $scope.showPeople=true;
  }

  $scope.loginOut=function(){
    $http.get("/loginOut").success(function(data, status){
      if(data.ok){
        User.set(null);
        $scope.showPeople=false;

        $scope.ajaxLogin=false;
        $scope.nameLogin=false;
        
        $location.path("/login");
      }
    });
  }

  //订阅收到消息信息
  $scope.$on("loginInok",function (event,msg) {
    $scope.name=msg.name;
    $scope.nameLogin=true;
  });
});

});