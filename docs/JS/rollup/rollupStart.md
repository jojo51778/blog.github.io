## rollup之路

### api精简笔记

编译`src`下`main.js`
可以用命令
```js
rollup src/main.js -o bundle.js -f cjs
```
也可以新建一个rollup文件在`根目录`下,运行`rollup -c`即可
```js
export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  }
}
```

### Rollup 与其他工具集成
##### npm packages
- 在某些时候，你的项目很可能依赖于从npm安装到你的node_modules文件夹中的软件包。 与Webpack和Browserify这样的其他捆绑包不同，Rollup不知道如何打破常规去处理这些依赖。我们需要依赖插件`rollup-plugin-node-resolve`，这个插件几乎是`开发必备`

- 现在npm大多数CommonJs模块，而rollup主推ES模块，则需要rollup-plugin-commonjs对这些CommonJs模块进行处理。rollup-plugin-commonjs应该用在其他插件转换你的模块之前 - 这是为了防止其他插件的改变破坏CommonJS的检测。

### 不打包外部模块
```js
external: ['lodash']
```