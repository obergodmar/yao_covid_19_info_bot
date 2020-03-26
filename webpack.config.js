const path = require('path');

module.exports = {
    target: 'node',
    entry: ["babel-polyfill", './src'],
    output: {
        path: path.join(__dirname, './build/'),
        filename: 'main.bundle.js'
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                },
            }
        ]
    },
    plugins: []
};
