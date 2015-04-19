var funnel = require('broccoli-funnel');
var babelTranspiler = require('broccoli-babel-transpiler');
var fastBrowserify = require('broccoli-fast-browserify');
var concat = require('broccoli-concat');
var mergeTrees = require('broccoli-merge-trees');
var compileLess = require('broccoli-less-single');

var srcTree = funnel('./src', {
    include: ['**/*.js']
});

var babelTree = babelTranspiler(srcTree, {
    sourceMap: 'inline'
});

var browserifyTree = fastBrowserify(babelTree, {
    bundles: {
        'client-app.js': {
            entryPoints: ['client-app.js']
        }
    },
    browserify: {
        debug: true
    }
});

var vendorTree = funnel('bower_components', {
    include: [
        'lodash/lodash.js',
        'pixi.js/bin/pixi.js',
        'socket.io-client/socket.io.js'
    ]
});

var concatenatedVendor = concat(vendorTree, {
    inputFiles: [
        '**/*.js'
    ],
    outputFile: '/vendor.js',
    separator: '\n;\n',
    wrapInEval: false,
    wrapInFunction: false
});

var html = funnel('static', {
    include: [
        'index.html',
        'sprites/*'
    ]
});

var styles = compileLess(['./styles/'], 'app.less', 'app.css', {});

module.exports = mergeTrees([
    html,
    styles,
    browserifyTree,
    concatenatedVendor
]);
