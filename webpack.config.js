const path = require('path');

module.exports = {
    entry: {
        bundle: './client/app.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
    },
    resolve: {
        modules: [path.join(__dirname, 'client'), 'node_modules'],
    },
    devServer: {
        historyApiFallback: true,
        proxy: {
            '/ws': {
                target: 'http://127.0.0.1:3000/',
                ws: true,
            },
        },
    },
};
