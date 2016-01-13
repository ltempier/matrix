const express = require('express'),
    config = require('./config'),
    http = require('http'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

var app = express();
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

app.use('/*', function (req, res) {
    res.status(404).send('Not found');
});

var server = http.createServer(app);
server.listen(config.port, config.ip, function () {
    console.info('Express server listening on %d, in %s mode', config.port, config.env)
});

