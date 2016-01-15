const path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    clientPath = path.join(__dirname, 'client');

module.exports = {
    cache: true,
    devtool: 'source-map',
    context: clientPath,
    entry: [
        'webpack-hot-middleware/client?reload=true',
        path.join(clientPath, 'src', 'index.js')
    ],
    resolve: {
        root: clientPath,
        extensions: ['', '.jsx', '.js', '.json'],
        modulesDirectories: [
            'node_modules',
            path.resolve(__dirname, './node_modules')
        ]
    },
    output: {
        path: path.join(clientPath, "dist"),
        filename: '[name].bundle.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.join(clientPath, 'src', 'index.html')
        }),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.css$/,
                loader: "style!css",
                include: clientPath
            },
            //{
            //    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            //    loader: "url-loader?limit=10000&mimetype=application/font-woff"
            //},
            //{
            //    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            //    loader: "file-loader"
            //}
        ]
    }
};
