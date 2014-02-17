function loginCtrl($scope, $http, $location, User){
  $scope.formShow=true;
  $scope.errorShow=false;
  $scope.toggle=function(){
    $scope.formShow=$scope.formShow==true?false:true;
  }
  $scope.loginIn=function(){
    if(this.name&&this.password){
      $http.post("/loginAjax", {name:this.name,password:this.password}).success(function(data,status){
        if(data.ok){
          //http://blog.jobbole.com/54817/
          //数据传到外部
          User.set(data.info)
          $location.path("/index");
        }else{
          $scope.errorShow=true;
          $scope.error=data.message;
        }
      });
    }
  }
}
