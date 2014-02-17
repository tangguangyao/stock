function timeStock($scope, $http, $location ,User) {
	var userInfo=User.get();
	if(!userInfo){

		//后台验证是否登录
		//http://htmln.com/2013/12/%E5%9C%A8angularjs%E4%B8%AD%E4%BD%BF%E7%94%A8q%E5%90%8C%E6%AD%A5%E8%AF%BB%E5%8F%96%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%95%B0%E6%8D%AE/
		//http://stackoverflow.com/questions/17731942/how-to-load-data-synchronously-in-angularjs-application
		$http({method:'GET', url: '/isOnline'}).success(function(data, status){
			if(data.ok){
				User.set(data.info)
				userInfo=User.get();

				ajaxStock();

			}else{
				$location.path("/login");
			}
		});

	}
	function ajaxStock(){
		var stockCode=userInfo.stock.join(",");
		$scope.url = 'http://xueqiu.com/stock/quote.json?code='+stockCode+'&'+xueqiuUrl+'&callback=JSON_CALLBACK';
		$http({method: 'JSONP', url: $scope.url}).success(function(data, status) {
			for(var i=0,l=data.quotes.length;i<l;i++){
	      data.quotes[i].volume=(data.quotes[i].volume/10000).toFixed(2);
	      data.quotes[i].marketCapital=(data.quotes[i].marketCapital/100000000).toFixed(2);
	      if(Number(data.quotes[i].change)>0){
	        data.quotes[i].zdClass="red";
	        data.quotes[i].zdBack="danger";
	        data.quotes[i].change="+"+data.quotes[i].change;
	        data.quotes[i].percentage="+"+data.quotes[i].percentage+"%";
	      }else if(Number(data.quotes[i].change)===0){
	        data.quotes[i].zdClass="";
	        data.quotes[i].zdBack="";
	        data.quotes[i].percentage=data.quotes[i].percentage+"%";
	      }else{
	        data.quotes[i].zdClass="green";
	        data.quotes[i].zdBack="success";
	        data.quotes[i].percentage=data.quotes[i].percentage+"%";
	      }
	    }
	    $scope.stocks=data.quotes;
		});
	}
}

function topStock($scope, $http, $location ,User){
	var userInfo=User.get();
	var l;
}