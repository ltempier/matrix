const path = require('path'),
    async = require('async'),
    express = require('express'),
    config = require('./config'),
    session = require('express-session'),
    //MongoStore = require('connect-mongo')(session),
    webpack = require('webpack'),
    webpackMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware');

const isDeveloping = process.env.NODE_ENV !== 'production';
const clientPath = path.join(__dirname, '..');

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
    //store: new MongoStore(config.mongo)
}));

require('./components').init(app, function (err) {
    if (err)
        return console.error(err);

    if (isDeveloping) {
        const webpackConfig = require('../webpack.config.js');
        const compiler = webpack(webpackConfig);
        const middleware = webpackMiddleware(compiler, {
            contentBase: path.join(clientPath, 'src'),
            stats: {
                colors: true,
                hash: false,
                timings: true,
                chunks: false,
                chunkModules: false,
                modules: false
            }
        });

        app.use(middleware);
        app.use(webpackHotMiddleware(compiler));
        app.get('*', function response(req, res) {
            res.write(middleware.fileSystem.readFileSync(path.join(clientPath, 'dist', 'index.html')));
            res.end();
        });
    } else {
        app.use(express.static(path.join(clientPath, 'dist')));
        app.get('*', function response(req, res) {
            res.sendFile(path.join(clientPath, 'dist', 'index.html'));
        });
    }

    app.listen(config.port, config.ip, function () {
        console.info('Express server listening on %d, in %s mode', config.port, config.env)
    });
});

