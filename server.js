const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config.js');


// console.log('Generating dot data...');
// const pathsConfig = require('../XT5-webpack/path-const');
// const depcurise = require('dependency-cruiser').cruise;
// const {modules} = depcurise([`${pathsConfig.XT5_assets}/script/util`], {
//     outputType : 'dot',
//     exclude    : 'node_modules',
// });

const fs = require('fs');
const input = fs.readFileSync('./data.dot', {encoding: 'utf8'});

console.log('Start to render...');
config.plugins.push(new webpack.DefinePlugin({
    'DOT_INPUT': JSON.stringify(input),
}));

const app = express();
const devMiddleWare = require('webpack-dev-middleware')(webpack(config), {
    publicPath: config.output.publicPath,
    stats: {
        colors: true,
        hash: false,
        version: true,
        builtAt: false,
        timings: true,
        assets: true,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: true,
        errorDetails: true,
        warnings: true,
        publicPath: true,
    },
});

devMiddleWare.waitUntilValid(() => {
    const port = 8080;
    const url = `http://127.0.0.1:${port}`;

    app.listen(port, function (err) {
        if (err) {
            console.log(err);
            return;
        }

        const open = process.platform === 'darwin' ? 'open' : (process.platform === 'win32' ? 'start' : 'xdg-open');
        // open default browser to visit
        require('child_process').exec(`${open} ${url}`);
        console.log(`Deployed web at ${url}`);
    });
});

app.use(devMiddleWare);
