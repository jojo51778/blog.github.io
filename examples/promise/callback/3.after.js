let fs = require('fs')

// 异步解决方案 最早基于回调函数的，不能使用try catch解决异常
// node 中的回调函数的第一个参数，永远是error


function after(times, callback) {
  let renderObj = {}
  return function(key, value) {
    renderObj[key] = value
    if(--times == 0) {
      callback(renderObj)
    }
  }
}
let out = after(2, function(renderObj) {
  console.log(renderObj)
})
fs.readFile('examples/promise/callback/age.txt', 'utf8', function(error, data) {
  out('age', data)
})

fs.readFile('examples/promise/callback/name.txt', 'utf8', function(error, data) {
  out('name', data)
})
