const path = require('path');
const webpack = require('webpack');


module.exports = {
    context: path.resolve(__dirname),
    entry: './scripts/main',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'
    },

    watch: false,
    watchOptions: {
        aggregateTimeout: 100
    },

    devtool: 'cheap-source-map',

    resolve: {
        modules: ['node_modules'],
        extensions: ['.js']
    },
    resolveLoader: {
        modules: ['node_modules'],
        moduleExtensions: ['-loader'],
        extensions: ['.js']
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel',
                    options: {
                        presets: ['es2015']
                    }
                }]
            },
            {
                test: /\.html$/,
                loader: 'html'
            }
        ]
    },

};

