define(["jquery","angular", "app"], function($,angular, app) {

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


});