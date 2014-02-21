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
  $routeProvider.when('/stock/:uid', {
    templateUrl: 'app/stock.html',
    controller:stockCtrl
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

//处理关注和粉丝的数据
app.factory('watchAndFens', [function() {
  var watchAndFens={};
  watchAndFens.fn=function(data){
    for(var i=0,l=data.length;i<l;i++){
      if(data[i].myself){
        data[i].watch=false;
        data[i].unwatch=false;
      }else{
        if(data[i].haveWatch){//false表示没有关注
          data[i].watch=false;
          data[i].unwatch=true;
        }else{
          data[i].watch=true;
          data[i].unwatch=false;
        }
      }
    }
  };
  return watchAndFens;
}]);

app.factory('textExtract', [function() {
  var textExtract=function(comment,name){
    //正则获取@ 的用户,用户名3-15个英文或数字
    var aboutPeople=comment.match(/@\w{3,15}\s|@\w{3,15}$/g);
    if(!!aboutPeople){
      for(var i1=0,l1=aboutPeople.length;i1<l1;i1++){
        aboutPeople[i1]=aboutPeople[i1].replace(" ","").replace(/@/,"");
      }
    }else{
      aboutPeople=[];
    }
    //正则获取$$ 的股票代码/sh[0-9]{6}|sz[0-9]{6}/i
    var aboutStockcode=comment.match(/\$sh[0-9]{6}\$|\$sz[0-9]{6}\$/ig);
    if(!!aboutStockcode){
      for(var i2=0,l2=aboutStockcode.length;i2<l2;i2++){
        aboutStockcode[i2]=aboutStockcode[i2].replace(/\$/g,"");
      }
    }else{
      aboutStockcode=[];
    }
    //正则获取股票名称
    var aboutStockName=comment.match(/\$[\u4e00-\u9fa5]{2,6}\$/ig);
    if(!!aboutStockName){
      for(var i3=0,l3=aboutStockName.length;i3<l3;i3++){
        aboutStockName[i3]=aboutStockName[i3].replace(/\$/g,"");
      }
    }else{
      aboutStockName=[];
    }
    //前端解析的对象
    var commentObj={
      topic:comment,
      name:name,
      aboutPeople:aboutPeople,
      aboutStockcode:aboutStockcode,
      aboutStockName:aboutStockName
    };
    return commentObj;
  };
  return textExtract;
}]);
