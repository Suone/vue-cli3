let path = require('path');
//去console插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, dir);
}
console.log(process.env.NODE_ENV);
module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ? './' : '/', // 根路径
    outputDir: process.env.outputDir, // 打包的时候生成的一个文件名
    assetsDir: 'static', // 静态资源目录(js,css,img,fonts)这些文件都可以写里面
    filenameHashing: false,
    productionSourceMap: false,
    lintOnSave: false, // 是否开启eslint保存检测 ,它的有效值为 true || false || 'error'
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: {
            '/api': {
                target: 'http://www.51pm.local', // 你请求的第三方接口
                changeOrigin: true,
                secure: false,
                logLevel: 'debug',
                router: {}
            }
        }
    },
    chainWebpack: config => {
        config.resolve.alias.set('@', resolve('src')); // key,value自行定义，比如.set('@@', resolve('src/components'))
    },
    //  webpack插件配置
    configureWebpack: config => {
        let plugins = [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true,
                    },
                },
                sourceMap: false,
                parallel: true,
            })
        ]
        if (process.env.NODE_ENV !== 'development') {
            config.plugins = [...config.plugins, ...plugins];
            config.externals = {
                'vue': 'Vue',
                'vue-router': 'VueRouter',
                'vuex': 'Vuex',
                'axios': 'axios',
                "element-ui": "ELEMENT"
            }
        }

    }

};
