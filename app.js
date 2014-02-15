/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , MongoStore = require('connect-mongo')(express)
  , settings = require('./settings')
  , flash = require('connect-flash')
  , sock= require('./models/socket');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/*
* 前端单页面重构
*/
app.engine('html', require('ejs').renderFile);

app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({uploadDir:'./uploads'})); 
//app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret: settings.cookieSecret,
  key: settings.db,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    db: settings.db
  })
}));
// app.use(express.session({
//   secret: settings.cookieSecret,
//   cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
//   url: settings.url
// }));
//声明静态引用在前，路由规则在后
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//socket 通信
var server = http.createServer(app);
var io = require('socket.io').listen(server,{ log: false });//{ log: false }关掉终端debug
sock(io);//执行socket.js里面的内容

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

routes(app);

module.exports = app;