import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import glob from 'fast-glob'
import copy from "rollup-plugin-copy";

const destDir = 'build/lib'
export default args => ({
    input: glob.sync('src/**/*.js'),
    treeshake: false,
    external: [/^@babel\/runtime/, /^septima/, /^kenga/],
    output: {
        dir: destDir,
        format: "cjs",
        exports: "auto",
        preserveModules: true
    },
    plugins: [
        nodeResolve(), commonjs(),
        babel({
            babelHelpers: 'runtime',
            presets: [['@babel/preset-env', { modules: false }]],
            plugins: [["@babel/plugin-transform-runtime", {}]]
        }),
        copy({
            targets: [
                { src: 'src/**/*.d.ts', dest: destDir },
                { src: 'src/**/*.css', dest: destDir },
                { src: 'src/rich-text-area/*.css', dest: destDir },
                { src: 'src/rich-text-area/*.gif', dest: destDir },
                { src: 'src/rich-text-area/*.png', dest: destDir },
                { src: 'package.json', dest: destDir }
            ],
            flatten: false
        })
    ]
});
