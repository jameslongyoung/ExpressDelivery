var webpack=require("webpack");
module.exports = {
    entry:  {
        comment:["./public/javascripts-es6/BeAlert.js","./public/javascripts-es6/comment.js"],
        form:["./public/javascripts-es6/BeAlert.js","./public/javascripts-es6/form.js"],
        index:["./public/javascripts-es6/BeAlert.js","./public/javascripts-es6/index.js"],
        itemDisplay:["./public/javascripts-es6/BeAlert.js","./public/javascripts-es6/itemDisplay.js"],
        "itemDisplay-2":["./public/javascripts-es6/BeAlert.js","./public/javascripts-es6/itemDisplay-2.js"],
        "itemDisplay-3":["./public/javascripts-es6/BeAlert.js","./public/javascripts-es6/itemDisplay-3.js"],
        "itemDisplay-4":["./public/javascripts-es6/BeAlert.js","./public/javascripts-es6/itemDisplay-4.js"],
        login:["./public/javascripts-es6/BeAlert.js","./public/javascripts-es6/login.js"],
        orderManagement:["./public/javascripts-es6/BeAlert.js","./public/javascripts-es6/orderManagement"],
        telVerify:["./public/javascripts-es6/BeAlert.js","./public/javascripts-es6/telVerify.js"],
        userPanel:["./public/javascripts-es6/BeAlert.js","./public/javascripts-es6/userPanel.js"],
        slider:["./public/javascripts-es6/jquery-3.1.1.min.js","./public/javascripts-es6/slider.js"],
        login2:["./public/javascripts-es6/BeAlert.js","./public/javascripts-es6/login2.js"],
    },
    output: {
        path: __dirname + "/public/javascripts/",//打包后的文件存放的地方
        filename: "[name].js"//打包后输出文件的文件名
    },
    module: {
        rules: [
            {
                test: /(\.js)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "es2015"
                        ]
                    }
                },
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
    ]
}
