



# Webpack优化

###  构建优化

- ```js
  noParse: /jquery/,   //不去解析jquery中的依赖库
  ```

- output Library 定义输出变量。libraryTarget定义commonjs es6模块规范

  - 新建wepack.config.react.js

  ```js
  entry: {
    react: ['react', 'react-dom']
  }
  output: {
    filename: '_dll_[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: '_dll_[name]', // _dll_react,拿到输出变量
  }
  plugins: [
    new webpack.DllPlugin({
      name: '_dll_[name]',
      path: path.resolve(__dirname, 'dist', 'manifest.json')
    })
  ]
  ```

  - 主webpack文件引入DllRederencePlugin,拿到动态链接库

  ```js
  plugins: [
    new webpack.dllReferencePlugin({
      manifest: path.resolve(__dirname, 'dist', 'mainfest.json')
    })
  ]
  ```

- Happypack,构建多线程打包

  ```js
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      include: path.resolve('src'),
      use: 'Happypack/loader?id=js'
    },
    {
      test: /\.css$/,
      use: 'Happypack/loader?id=css'
    }
  ],
  plugins: [
    new Happypack({
      id: 'css',
      use: ['style-loader', 'css-loader']
    }),
    new Happypack({
      id: 'js',
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react'
          ]
        }
      }]
    })
  ]
  ```


- 热更新

  ```js
  if(module.hot) {
    module.hot.accept('./source', () => {
      let str = require('./source')
      console.log(str)
    })
  }
  ```

  

### 打包优化

- ```js
  new webpack.IgnorePlugin(/\.\/locale/, /monent/) //手动引入语言包
  ```

- 生产环境`mode: production`自动去除没用的代码，tree-shaking ,`import`语法专有,require没有。
  scope hosting 作用域提升，在webpack中自动省略，可以简化的代码

  ```js
  let a = 1;
  let b = 2;
  let c = 3;
  let d = a+b+c; //自动省略，直接输出6
  ```

- 多页面抽离公共代码
  ```js
  // splitChunks 多页面抽取公共模块
  entry: {
    index: './src/index.js', //多页抽取公共模块
    other: './src/other.js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          chunks: 'initial' // 模式
          minSize: 0, //大小
          minChunks: 2, //至少两次引用
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          minSzie: 0,
          minChunks: 2,
          priority: 1, //权重，优先抽离第三方模块
        }
      }
    }
  }
  ```

- 懒加载
  `@babel/plugin-syntax-dynamic-import`

  ```js
  // jsonp实现的
  import('./source.js').then(data => {
    console.log(data.default); // 结果Module
  })
  ```

  