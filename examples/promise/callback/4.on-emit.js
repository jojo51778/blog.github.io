// 发布订阅 所有库中都存在发布订阅 订阅方和发布方没有任何关系
// 观察者模式
let fs = require('fs')

let e = {
  _obj: {},
  _callback: [],
  on(callback) { //订阅
    this._callback.push(callback)
  },
  emit(key, value) { //发布
    this._obj[key] = value
    this._callback.forEach(method => {
      method(this._obj)
    })
  }
}
e.on(function(obj) {
  console.log('获取一个')
})
e.on(function(obj) { // 每次发布触发此函数
  if(Object.keys(obj).length === 2) {
    console.log(obj)
  }
})
// 多个类之间可以解除耦合关系
fs.readFile('examples/callback/promise/age.txt', 'utf8', function(error, data) {
  e.emit('age', data)
})

fs.readFile('examples/callback/promise/name.txt', 'utf8', function(error, data) {
  e.emit('name', data)
})
