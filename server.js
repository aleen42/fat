const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config.js');
const path = require('path');

const fs = require('fs');
const dotPath = path.resolve('./util.dot');
const input = fs.readFileSync(dotPath, {encoding: 'utf8'});

console.log('Start to render...');
config.plugins.push(new webpack.DefinePlugin({
    'DOT_INPUT': JSON.stringify(input),
    'DOT_NAME': JSON.stringify(path.basename(dotPath, '.dot')),
    'MODULES': JSON.stringify(['@project.revision@/script/component$', 'cui$', '@project.revision@/script/util$']),
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
