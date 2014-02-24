define(["angular", "app"], function(angular, app) {
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

});