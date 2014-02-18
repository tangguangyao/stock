function loginCtrl($scope, $http, $location, User){
  var userInfo=User.get();
  if(userInfo){
    $location.path("/index");
    return;
  }

  //隐藏错误信息
  $scope.errorShow=false;
  //注册，登录切换效果
  $scope.formShow=true;
  $scope.toggle=function(){
    $scope.formShow=$scope.formShow==true?false:true;
  }

  $scope.loginIn=function(){
    if(this.name&&this.password){
      $http.post("/loginAjax", {name:this.name,password:this.password}).success(function(data,status){
        if(data.ok){
          //数据传到外部
          User.set(data.info);

          //监听改变，发布事件给父作用域
          $scope.$emit("loginIn", data.info);

          $location.path("/index");
        }else{
          $scope.errorShow=true;
          $scope.error=data.message;
        }
      });
    }
  }
}
