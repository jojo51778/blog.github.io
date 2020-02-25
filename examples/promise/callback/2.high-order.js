// 对某些函数进行扩展 面向切片编程
function say(who) {
  console.log('say', who)
}
// 在说话之前去干一些事情 
Function.prototype.before = function(callback) {
  return (...args) => { //this向上级作用域查找
    callback()
    this(...args);
  }
}
let newSay = say.before(function() {
  console.log('刷牙')
})

newSay('我')

console.log(say.__proto__ === Function.prototype)