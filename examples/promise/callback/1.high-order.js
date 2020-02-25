// 函数参数为函数
// 函数中返回函数，闭包
function isType(type) {
  // 将String保存在这个代码块中
  return function(content) {
    return Object.prototype.toString.call(content) === `[object ${content}]`
  }
}
// let isString = isType('String')
// // 闭包：在定义的时候函数就决定了一个函数不在自己所在的作用域下执行
// isString('hello') // true
// let isNumber = isType('Number')
// isNumber(2)
let util = {};
['String', 'Number'].forEach((type) => {
  util['is' + type] = isType(type)
})
console.log(util.isString('hello'))
// 函数的柯里化(范围缩小)， 函数反柯里化(扩大函数的范围)
// function isType(type,content) {

// }

// let isString = currying(isType, 'String')
// isString('hello')

// 反柯里化
// Object.prototype.toString => toString()