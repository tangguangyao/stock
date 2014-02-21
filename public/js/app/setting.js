function settingCtrl($scope, $http) {
	$scope.userInfo=User.get();
	if(!$scope.userInfo){
		$location.path("/login");
		return;
	}else{
		$scope.$emit("loginIn", $scope.userInfo);
	}

	$http.get("/settingAjax").success(function(data,status){
    if(data.isOk){
      $scope.user=data.user;
      $scope.user.info.pic.big="/images/"+data.user.info.pic.big;
    }else{
    	$location.path("/login");
			return;
    }
  });

}

function changeInfoCtrl($scope, $http){
	$("#upImg").load(function () {
    var url = this.contentWindow.location.href;
    var obj=parseUrl(url);
    if(obj.status=="1"){
    	$scope.$parent.message="修改信息成功";
    }else{
    	$scope.$parent.message="修改信息出错";
    }
    $scope.$apply();
    //信息被封装在url中，解析url来获取后台返回的数据
});

	function parseUrl(url){
    var i=url.indexOf('?');
    if(i==-1)return;
    var querystr=url.substr(i+1);
    var arr1=querystr.split('&');
    var arr2=new Object();
    for  (i in arr1){
        var ta=arr1[i].split('=');
        arr2[ta[0]]=ta[1];
    }
    return arr2;
  }
}

function changePassport($scope, $http){
	$scope.subPassword=function(){
		var change={
			oldPassword:$scope.oldPassword,
			newPassword:$scope.newPassword,
			reNewPassword:$scope.reNewPassword
		}
		$http.post("/setPasswordAjax",change).success(function(data,status){
			if(data.isOk){
				$scope.$parent.message="修改密码成功";
			}else{
				$scope.$parent.message="修改密码失败";
			}
		});
	}
}