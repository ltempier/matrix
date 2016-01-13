const async = require('async'),
    express = require('express'),
    config = require('./config'),
    http = require('http'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

var app = express(),
    components = require('./components');

app.use(session({
    name: 'session',
    secret: '53cr37m4l4qu415',
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: true,
    store: new MongoStore(config.mongo)
}));

components.init(app, function (err) {
    if (err)
        return console.error(err);
    var server = http.createServer(app);
    server.listen(config.port, config.ip, function () {
        console.info('Express server listening on %d, in %s mode', config.port, config.env)
    });
});

