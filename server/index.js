const path = require('path'),
    async = require('async'),
    express = require('express'),
    config = require('./config'),
    session = require('express-session'),
    bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
    name: 'session',
    secret: 'S0S0S0Secret123',
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, '..', 'dist')));

require('./components').init(app, function (err) {
    if (err)
        return console.error(err);

    app.listen(config.port, config.ip, function () {
        console.info('Express server listening on %d, in %s mode', config.port, config.env)
    });
});

