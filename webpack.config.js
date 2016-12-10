const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

if (!process.env.CURSOR_SOCKET_URL) {
    throw Error('Need to add a `CURSOR_SOCKET_URL` env variable!');
}

module.exports = {
    entry: {
        bundle: './client/app.js',
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist'),
    },
    resolve: {
        modules: [path.join(__dirname, 'client'), 'node_modules'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'client/index.html'),
        }),
        new webpack.DefinePlugin({
            CONFIG: JSON.stringify({
                socketUrl: process.env.CURSOR_SOCKET_URL,
            }),
        }),
    ],
    module: {
        rules: [
            {
                // Extract all non-CSS and non-JS assets.
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: 'file-loader',
            }
        ],
    },
};
