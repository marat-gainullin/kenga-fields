import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {babel} from '@rollup/plugin-babel';
import page from 'rollup-plugin-generate-html-template';
import styles from 'rollup-plugin-styles';
import path from "path";
import assert from "assert";
import shell from 'shelljs';

const srcDir = 'src';
const testDir = 'test';
const buildDir = 'build';

const config = {
    input: `${testDir}/fields-specs.js`,
    output: {
        file: `${buildDir}/fields-specs.js`,
        format: "iife",
        sourcemap: true,
        assetFileNames: "assets/[name].[ext]",
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        styles(),
        babel({
            babelHelpers: 'bundled',
            presets: [['@babel/preset-env', {modules: false}]],
        }),
        page({template: `${testDir}/cases.html`}),
        {
            name: 'browse', closeBundle: () => {
                const opened = shell.exec(path.resolve(buildDir, 'cases.html'));
                assert(opened.code === 0, opened.stderr);
            }
        }
    ]
};

export default config;
