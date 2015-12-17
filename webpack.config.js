const path = require("path");

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
    tslint: {
        emitErrors: true,
        formattersDirectory: "../node_modules/tslint-loader/formatters/"
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: "body",
            template: "src/index.html"
        })
    ]
};
