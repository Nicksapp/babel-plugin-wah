const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const entryJSON = require('./project/entry.json');
// 入口管理
let entry = {}
entryJSON.map(page => {
    entry[page.url] = path.resolve(__dirname, `./project/page/${page.url}/index.js`)
})

// 因为多入口，所以要多个HtmlWebpackPlugin，每个只能管一个入口
let plugins = entryJSON.map(page => {
    return new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, `./dist/${page.url}.html`),
        template: path.resolve(__dirname, `./project/WEB-INF/views/page/${page.url}/index.html`),
        chunks: [page.url], // 实现多入口的核心，决定自己加载哪个js文件，这里的 page.url 指的是 entry 对象的 key 所对应的入口打包出来的js文件
        hash: true, // 为静态资源生成hash值
        minify: false,   // 压缩，如果启用这个的话，需要使用html-minifier，不然会直接报错
        xhtml: true,    // 自闭标签
    })
})

module.exports = {
    // 入口文件
    entry: entry,
    // 出口文件
    output: {
        path: path.resolve(__dirname, 'dist'),
        // 文件名，将打包好的导出为bundle.js
        filename: '[name].[hash:8].js'
    },
    resolve: {
        alias: {
            'base': path.resolve(__dirname, './project/javascript/lib/nej/src/base'),
            'pro': path.resolve(__dirname, './project/javascript'),
            'lib': path.resolve(__dirname, './project/javascript/lib/nej/src'),
            'ui': path.resolve(__dirname, './project/javascript/lib/nej/src/ui'),
            'util': path.resolve(__dirname, './project/javascript/lib/nej/src/util'),
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.(html|ftl)$/,
            exclude: /node_modules/,
            loader: 'html-loader'
        }]
    },
    // 省略中间的配置
    // 将插件添加到webpack中
    plugins: [
        ...plugins
    ]
}