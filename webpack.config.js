const webpack = require('webpack');

module.exports = {
    entry:  __dirname + "/src/main.js",//已多次提及的唯一入口文件
    devtool: 'eval-source-map',
    output: {
        path: __dirname + "/public",//打包后的文件存放的地方
        filename: "bundle.js"//打包后输出文件的文件名
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ],
    devServer: {
        contentBase: './public',
        historyApiFallback: true,
        inline: true,
        proxy: {
            '/api': {
                target: 'http://api.zhuishushenqi.com/',
                pathRewrite: {'^/api' : '/'},
                changeOrigin: true
            },
            '/chapter': {
                target: 'http://chapter2.zhuishushenqi.com/',
                pathRewrite: {'^/chapter' : '/chapter'},
                changeOrigin: true
            }
        }
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: { loader: 'babel-loader'},
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [{loader:'style-loader'},{loader:'css-loader?modules&localIdentName=[name]_[local]-[hash:base64:5]'}]
            },
            {
                test: /\.(png|jpg|gif|woff|woff2)$/,
                loader: 'url-loader?limit=8192'
            },
            {
                test: /\.less/,
                loader: 'style-loader!css-loader!less-loader'
            }
        ]
    }
}