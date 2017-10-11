var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var form = require('./routes/form');
var login=require('./routes/login');
var itemDisplay=require("./routes/itemDisplay")
var swig=require("swig");
var telVerify=require("./routes/telVerify");
var userPanel=require("./routes/userPanel");
var orderManagement=require("./routes/orderManagement");
var comment=require("./routes/comment");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function (req,res,next) {
    console.log(req.params);
    next();
})
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/',login);
app.use('/telVerify',telVerify);
app.use('/index',index);
app.use("/userPanel",userPanel);
app.use('/form', form);
app.use('/itemDisplay',itemDisplay);
app.use('/orderManagement',orderManagement);
app.use('/comment',comment);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

