// 为了让rollup识别commonjs类型的包,默认只支持导入ES6
import commonjs from 'rollup-plugin-commonjs'
// 为了支持import xx from 'xxx'
import nodeResolve from 'rollup-plugin-node-resolve'
// ts转js的编译器
import typescript from 'rollup-plugin-typescript2'
// 支持加载json文件
import json from 'rollup-plugin-json'
// 支持字符串替换, 比如动态读取package.json的version到代码
import replace from 'rollup-plugin-replace'
// 读取package.json
import pkg from './package.json';
// 代码生成sourcemaps
import sourceMaps from 'rollup-plugin-sourcemaps'

// 代码头
const banner =
  `/*!
 * rainx.js v${pkg.version}
 * (c) 2019-${new Date().getFullYear()} Seymoe
 * https://github.com/seymoe/rainx
 * Released under the MIT License.
 */`

export default {
  input: './src/index.ts',
  output: [
    {
      format: 'cjs',
      // 生成的文件名和路径
      // package.json的main字段, 也就是模块的入口文件
      file: pkg.main,
      banner,
      sourcemap: true
    },
    {
      format: 'es',
      // rollup和webpack识别的入口文件, 如果没有该字段, 那么会去读取main字段
      file: pkg.module,
      banner,
      sourcemap: true
    },
    {
      format: 'umd',
      name: 'rainx',
      file: pkg.browser,
      banner,
      sourcemap: true
    }
  ],
  plugins: [
    // 代码中的__VERSION__字符串会被package.json中的version字段所替代
    replace({
      __VERSION__: pkg.version
    }),

    typescript(),

    json(),

    nodeResolve({
      jsnext: true,
      main: true
    }),

    commonjs({
      include: 'node_modules/**'
    }),

    sourceMaps()
  ]
}