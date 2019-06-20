const {
    uglify
} = require('rollup-plugin-uglify');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

module.exports = {
    input: 'lib/pjsonp.js',
    output: {
        file: 'dist/pjsonp.js',
        format: 'umd',
        name: 'promisify-jsonp'
    },
    plugins: [
        nodeResolve({
            browser: true
        }),
        commonjs(),
        uglify()
    ]
};