angular.module('App', []);

function IndexCtrl($scope, $http, $templateCache) {
  //关注列表
  var watchList=[];
  //热门列表
  var topList=[];
  //清洗热门列表
  var newTopList=[];
  //新关注数据
  var newMyStock;
  //删除我的关注列表
  var newlist=[];
  //定时请求的列表
  var stockCode;
  //删除的股票uid和url
  var delStockUid;
  var delWatchUrl;
  //关注一个热门uid和url
  var topStockUid;
  var topWatchUrl
  //为了解决删除自选股，增加热门关注效果的ng-show问题
  var newArrtop=[];

  //定时获取关注数据
  function ajaxStock(){
    $scope.method = 'JSONP';
    stockCode=$("#stockList").attr("my-stock");
    //$scope.url = 'http://xueqiu.com/stock/quote.json?code='+pathUrl+'&callback=JSON_CALLBACK';
    if(stockCode==""){
      //如果没有信息，就不请求
      return;
    }
    $scope.url = 'http://xueqiu.com/stock/quote.json?code='+stockCode+'&key=47bce5c74f&access_token=aZy51015GfDGsvsNtit2XY&_=1384782884165&callback=JSON_CALLBACK'
    $scope.code = null;
    $scope.response = null;
    $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
      success(function(data, status) {
        for(var i=0,l=data.quotes.length;i<l;i++){
          data.quotes[i].volume=(data.quotes[i].volume/10000).toFixed(2);
          data.quotes[i].marketCapital=(data.quotes[i].marketCapital/100000000).toFixed(2)
          if(Number(data.quotes[i].change)>0){
            data.quotes[i].zdClass="red";
            data.quotes[i].zdBack="danger";
            data.quotes[i].change="+"+data.quotes[i].change;
            data.quotes[i].percentage="+"+data.quotes[i].percentage+"%";
          }else if(Number(data.quotes[i].change)==0){
            data.quotes[i].zdClass="";
            data.quotes[i].zdBack="";
            data.quotes[i].percentage=data.quotes[i].percentage+"%";
          }else{
            data.quotes[i].zdClass="green";
            data.quotes[i].zdBack="success";
            data.quotes[i].percentage=data.quotes[i].percentage+"%";
          }
        }
        $scope.stocks=watchList=data.quotes;
      });
  }
  ajaxStock();
  var hours;
  var now;
  function start(){
     now = new Date();
     hours = now.getHours();
     if(hours>9&&hours<15){
        ajaxStock();
        setTimeout(start,10000);
     }
  }
  start();

  //请求热门股
  $http({method: "GET", url: "/hotStock", cache: $templateCache}).
    success(function(data,status){
      if(data.ok){
        for(var k=0,l3=data.list.length;k<l3;k++){
          data.list[k].haveWatch=true;
          data.list[k].num=k;
        }
        var userWatchList=$("#stockList").attr("my-stock").split(",");
        for(var i=0,l=userWatchList.length;i<l;i++){
          for(var j=0,l2=data.list.length;j<l2;j++){
            
            if(userWatchList[i]==data.list[j].uid){
              data.list[j].haveWatch=false;
            }
          }
        }
        $scope.topList=topList=data.list;
      }
    });

  //请求热门用户
  var topPeopleList;
  $http({method: "GET", url: "/hotPeople", cache: $templateCache}).
    success(function(data,status){
      if(data.ok){
        for(var i=0,l=data.list.length;i<l;i++){
          data.list[i].num=i;
        }
        $scope.peoples=topPeopleList=data.list;
      }
    });

  //关注热门人物
  $scope.topPeople=function(people){
    var name=people.name;
    var num=people.num;
    if($("#headShowName").text()==name){
      alert("不能关注自己");
      return;
    }
    $http({method: "GET", url: "/watchPeople?name="+name, cache: $templateCache}).
      success(function(data,status){
        if(data.ok){
          var newArrayTop=[];
          for(var i=0,l=topPeopleList.length;i<l;i++){
            newArrayTop.push({
              num:topPeopleList[i].num,
              name:topPeopleList[i].name,
              top:topPeopleList[i].top,
              isWatch:topPeopleList[i].isWatch
            })
          }
          newArrayTop[num].isWatch=true;
          newArrayTop[num].top++;
          $scope.peoples=topPeopleList=newArrayTop;
        }
      });
  }


  //删除关注的股票
  $scope.delStock = function(stock) {
    delStockUid=stock.symbol.toLowerCase();
    delWatchUrl="watchStock?uid="+delStockUid+"&name="+stock.name+"&beWatchName="+$("#headShowName").text()+"&beWatchTop="+$("#headShowName").attr("top")+"&add=0";
    $http({method: "GET", url: delWatchUrl, cache: $templateCache}).
      success(function(data, status) {
        newlist=[];
        if(data.ok){
          for(var i=0,l=$scope.stocks.length;i<l;i++){
            if($scope.stocks[i].name!=stock.name){
              newlist.push($scope.stocks[i]);
            }
          }
          $scope.stocks=watchList=newlist;

          for(var h=0,l5=topList.length;h<l5;h++){
            if(delStockUid==topList[h].uid){
              topList[h].haveWatch=true;
              // topList[h].top--;
              newArrtop=[];
              for(var h=0,l6=topList.length;h<l6;h++){
                newArrtop.push({
                  uid:topList[h].uid,
                  name:topList[h].name,
                  top:topList[h].top,
                  haveWatch:topList[h].haveWatch,
                  num:topList[h].num
                })
              }
              $scope.topList=newArrtop;
              return;
            }
          }

          
        }else{
          alert("出错了");
        }
      });
  }

  //关注一个热门
  $scope.topWatch=function(list){
    topStockUid=list.uid.toLowerCase();
    topWatchUrl="watchStock?uid="+topStockUid+"&name="+list.name+"&beWatchName="+$("#headShowName").text()+"&beWatchTop="+$("#headShowName").attr("top")+"&add=1";
    $http({method: "GET", url: topWatchUrl, cache: $templateCache}).
      success(function(data, status) {
        if(data.ok){
          //刷新热门列表
          //清洗对象,angularjs不让$scope.topList直接改变重新赋值
          for(var m=0,l3=topList.length;m<l3;m++){
            newTopList[m]={
              haveWatch:topList[m].haveWatch,
              name:topList[m].name,
              top:topList[m].top,
              uid:topList[m].uid,
              num:topList[m].num
            }
          }
          newTopList[list.num].haveWatch=topList[list.num].haveWatch=false;
          //关注数增加1
          newTopList[list.num].top++;
          topList[list.num].top++;
          $scope.topList=newTopList;
          //刷新我的收藏
          $scope.addMethod = 'JSONP';
          $scope.addUrl = 'http://xueqiu.com/stock/quote.json?code='+topStockUid+'&access_token=aZy51015GfDGsvsNtit2XY&_=1384756173203&callback=JSON_CALLBACK';
          $http({method: $scope.addMethod, url: $scope.addUrl, cache: $templateCache}).
            success(function(data, status) {
              //请求关注的数据
              data.quotes[0].volume=(data.quotes[0].volume/10000).toFixed(2);
              data.quotes[0].marketCapital=(data.quotes[0].marketCapital/100000000).toFixed(2)
              if(Number(data.quotes[0].change)>0){
                data.quotes[0].zdClass="red";
                data.quotes[0].zdBack="danger";
                data.quotes[0].change="+"+data.quotes[0].change;
                data.quotes[0].percentage="+"+data.quotes[0].percentage+"%";
              }else if(Number(data.quotes[0].change)==0){
                data.quotes[0].zdClass="";
                data.quotes[0].zdBack="";
                data.quotes[0].percentage=data.quotes[0].percentage+"%";
              }else{
                data.quotes[0].zdClass="green";
                data.quotes[0].zdBack="success";
                data.quotes[0].percentage=data.quotes[0].percentage+"%";
              }
              watchList.push(data.quotes[0]);
              $scope.stocks=watchList;
              //在$("#stockList").attr("my-stock") 中增加更新,增加定时关注数据
              newMyStock=$("#stockList").attr("my-stock")+","+topStockUid;
              $("#stockList").attr("my-stock",newMyStock);
            });
        }else{
          alert("出错了");
        }
      });
  }
}