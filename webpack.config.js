const path = require('path');
const webpack = require('webpack');


module.exports = {
    context: path.resolve(__dirname),
    entry: './main',
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
        rules: [    // этот массив будет ловить все файлы js
            {
                test: /\.js$/,
                exclude: [/node_modules/],  // исключаем файлы node-файлы, их не нужно пропускать через babel
                use: [{
                    loader: 'babel',
                    options: {
                        presets: ['es2015']
                    }
                }]// и теперь хотим вызвать на все js файлы, которые он найдет, babel-loader
            },
            {
                test: /\.css$/,
                exclude: [/node_modules/],
                loader: 'style!css'
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|otf)$/,
                exclude: [/node_modules/],
                loader: 'file?name=[path][name].[ext]'
            },
            {
                test: /\.html$/,
                loader: 'html'
            }
        ]
    },

};

