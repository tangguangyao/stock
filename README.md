**项目目的：**

  - 边学边实践，项目中使用npm中比较热门的插件，
  - 例如redis实现缓存；
  - grunt实现前端代码管理；
  - async实现流程控制；
  - gm实现图片大小处理；
  - socket实现及时通信；
  - mocha实现单元测试
  - 还有前端使用angularjs


**功能：**

  - 股票页面聊天室功能：

   a. 聊天室以股票为单位，同一个用户可以进入多个股票的聊天室进行聊天 

   b. 聊天记录可以设置缓存数量，默认为20条，如果超过20条会存储到数据库中,当聊天室中没有用户也会将聊天内容存入数据库中

   聊天室代码：
   https://github.com/tangguangyao/stock/blob/master/models/socket.js


  - 微博类似的话题，评论，回复，转发功能，前端使用angularjs绑定实现

  - 页面实时交互，包括关注股票，关注用户功能

  - 股票页面能查看讨论这个股票的话题

  - 个人页面能查看我关注的用户的话题，关注股票的相关话题，我的话题，@我的话题

  - 加入grunt管理代码，引入uglify压缩代码，jshint检测代码规范，watch监听代码变化

  - 使用mocha检测后端代码
   检测代码在test中
   总结mocha单元测试经验
   http://hi.baidu.com/tang_guangyao/item/302a9d1a9976c06ae65e0643

  - 加入async流程控制，对于需要多次回调查询数据库的进行重构

  - 尝试bigpige，首页利用bigpipe，加载热门股票和热门用户，并且和angular结合使用

  - 使用外网免费数据库https://app.mongohq.com

  - 跨域请求的雪球网具体股票数据

  - 增加redis插件尝试（需要安装redis客户端http://redis.io/，推荐一个redis管理工具mac和win都可以使用http://redisdesktop.com/ ），首页点击我的评论，对我的评论加上redis处理，如果有缓存加载缓存内容，如果有缓存，但是在首页评论过，则去数据库取数据并且更新缓存


**更新说明：**

  -因为股票具体数据是跨域请求的雪球网接口，雪球接口的参数会定时改变，所以对接口参数处理了一下，放入views的top.ejs文件中。

  -重构部分前端


**安装方法：**

  >首先安装nodejs,mongodb,redis(缓存使用),imageMagick（图片处理使用）

  > `git clone https://github.com/tangguangyao/stock.git`

  > `npm install`

  > `node app.js`

**访问网站：**

  -http://localhost:3000/ 访问为使用ejs的nodejs模板，使用angularjs作为数据绑定用，由于这是第一次在复杂项目中使用angularjs，所以没有使用好angularjs，文档非常烂。

  -http://localhost:3000/app/app.html 是对前端使用angularjs的一个重新规划，目前正在学习angularjs重构中




**备注：**
  -由于第一次正式尝试angularjs，所以没有用好，仅仅用上了数据绑定的功能，这个项目如果用angularjs做前端的话，其实做单页更加好，这样可以省掉后端的ejs模板。
  -下一步重构可以考虑合并为单页模式。
  -另外angularjs的每个控制模块太大，里面包含功能太多，也需要拆分。