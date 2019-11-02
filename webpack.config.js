var path = require('path');
var webpack = require('webpack');

function generateConfig(name) {
    var uglify = name.indexOf('min') > -1;
    var config = {
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: name + '.js',
            sourceMapFilename: name + '.map',
            library: 'pjsonp',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        mode: 'production',
        devtool: 'source-map'
    };

    config.plugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ];

    config.optimization = {
        minimize: uglify
    };

    return config;
}

var config = ['pjsonp', 'pjsonp.min'].map(generateConfig);

module.exports = config;