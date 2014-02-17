function IndexCtrl($scope, $http, $location ,User) {
	var userInfo=User.get();
	var stockCode=userInfo.stock.join(",");
	$scope.url = 'http://xueqiu.com/stock/quote.json?code='+stockCode+'&'+xueqiuUrl+'&callback=JSON_CALLBACK';
	$http({method: 'JSONP', url: $scope.url}).success(function(data, status) {
		//alert(1);
	// data=stock.index.ajaxStockTime(data);
	// // $scope.stocks=watchList=data.quotes;
	// $scope.stocks=data.quotes;
	});
}