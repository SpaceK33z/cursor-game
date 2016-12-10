const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    ],
    devServer: {
        proxy: {
            '/ws': {
                target: 'http://127.0.0.1:3000/',
                ws: true,
            },
        },
    },
};
