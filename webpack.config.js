const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './index.jsx',
    mode: 'development',
    devtool: 'cheap-source-map',
    output: {
        filename: '[name].js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: ['node_modules', '.'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            chunks: ['main'],
        }),
    ],
    module: {
        rules: [
            {
                /** style */
                test: /\.(css|less)$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {loader: 'less-loader'},
                ],
            },

            {
                /** babel */
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react'],
                    },
                },
            },
        ],
    },
};
