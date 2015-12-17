const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    entry: {
        app: "./src/app.js"
    },
    output: {
        filename: "[name].js",
        path: __dirname
    },
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loaders: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: [
                        "es2015",
                        "react"
                    ]
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: "body",
            template: "src/index.html"
        })
    ]
};
