var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
 
var routes = require('./routes/index');
var users = require('./routes/users');
 
var app = express();
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

 
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

// Setup the DB

//采用connect-mongodb中间件作为Session存储  
var session = require('express-session');  
var Settings = require('./database/settings');  
var MongoStore = require('connect-mongodb');  
var db = require('./database/msession');

// Configure the session
app.use(session({
    cookie: { maxAge: 600000 },
    secret: Settings.COOKIE_SECRET,
    store: new MongoStore({  
        username: Settings.USERNAME,
        password: Settings.PASSWORD,
        url: Settings.URL,
        db: db})
}))


function authentication(req, res) {
    if (!req.session.user) {
        req.session.err = "Please Login First."
        console.log("Output: Please Login First")
        return res.redirect('/login');
    }
}

app.use(function(req, res, next){
    res.locals.user = req.session.user;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = ''
    if (err) {
        res.locals.message = '<div class="alert alert-warning">' + err + '</div>';
    }

    console.log("Current URL:" + req.url)
    if ((!req.session.user) && (!(req.url == '/login'))){
        res.redirect("/login")
    }
    next();
});

//

app.use(express.static(path.join(__dirname, 'public')));
 
app.use('/', routes);
app.use('/users', users);
 app.use('/login', routes);
app.use('/logout', routes);
app.use('/home', routes);
 
 
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
 
/// error handlers
 
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
 
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;