define(["angular", "app"], function(angular, app) {
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

});