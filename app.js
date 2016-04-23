//通过require加载express path serve-favicon morgan
// cookie-parser body-parser

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('myapp:server');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var http = require('http');
//加载路由routes/index  routes/users
var routes = require('./routes/index');
var settings = require('./settings');
var flash = require('connect-flash');

var users = require('./routes/users');

var app = express();//生成一个express实例


//设置端口号3000
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
//启动工程并监听3000端口，成功后打印成功信息
var server = http.createServer(app);
//启动网络服务监听端口
// server.listen(port);
// server.on('error', onError);
// server.on('listening', onListening);


//设置views文件夹为存放视图文件的目录，及存放文件模板的地方，
//__dirname为全局变量，存储当前正在执行的脚本所在的目录

app.set('views', path.join(__dirname, 'views'));

//设置视图模板引擎为ejs
app.set('view engine', 'ejs');

app.use(flash());
//设置/public/favicon.ico 为favicon图标
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//加载日志中间件
app.use(logger('dev'));
//加载解析json的中间件
app.use(bodyParser.json());
//加载解析urlencoded请求体的中间件
app.use(bodyParser.urlencoded({ extended: false }));
//加载解析cookie的中间件
app.use(cookieParser());
//设置public文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname,'public')));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
//路由控制器
// app.use('/', routes);
// app.use('/users', users);

routes(app);

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

app.use(session({
    secret: settings.cookieSecret,//防止篡改cookie
    key: settings.db,//cookie名字
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//生存期
    store: new MongoStore({
        db: settings.db,
        host: settings.host,
        port: settings.port
    })
}));

// 捕获404错误，并转发到错误处理器
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//开发环境下的错误处理器，将错误信息渲染error模板并显示到浏览器中
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//生产环境下的错误处理器，将错误信息渲染error模板并显示到浏览器中
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//端口标准化函数
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

//http异常事件处理函数
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
//事件绑定函数
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

//导出app实例供其他模块调用
module.exports = app;
