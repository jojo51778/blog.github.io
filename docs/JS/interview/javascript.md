# JavaScript

## js有哪些类型？
基本类型:

- boolean
- null
- undefined
- number
- string
- symbol

引用类型:
- Object

## 变量提升？
```js
console.log(a) // undefined

var a = 1
```
JavaScript引擎的工作方式是，先`解析代码`，`获取`所有被`声明的变量`，然后再一行一行地运行。这造成的结果，就是所有的变量的声明语句，都会被提升到`代码的头部`，这就叫做`变量提升`（hoisting）。
实际情况
```js
var a
console.log(a) 
a = 1
```

## JavaScript的基本类型和复杂类型是储存在哪里的？
基本类型储存在栈中，但是一旦被闭包引用则成为常住内存，会储存在内存堆中。

复杂类型会储存在内存堆中。

## JavaScript的参数是按照什么方式传递的？
#### 按值传递
```js
var a = 1;
function test(x) {
  x = 10;
  console.log(x);
}
test(a); // 10
console.log(a); // 1
```
虽然在函数test中a被修改,并没有有影响到 外部a的值,基本类型是按值传递的.

#### 复杂类型按引用传递?
```js
var a = {
  a: 1,
  b: 2
};
function test(x) {
  x.a = 10;
  console.log(x);
}
test(a); // { a: 10, b: 2 }
console.log(a); // { a: 10, b: 2 }
```
看起来是引用传递无疑了？？？
```js
var a = {
  a: 1,
  b: 2
};
function test(x) {
  x = 10;
  console.log(x);
}
test(a); // 10
console.log(a); // { a: 1, b: 2 }
```
哦豁，显然不是，并没有更改原始对象,

复杂类型之所以会产生这种特性,原因就是在传递过程中,对象`a`先产生了一个`副本a`,这个`副本a`并不是深克隆得到的`副本a`,`副本a`地址同样指向对象`a`指向的堆内存.

因此在函数体中修改`x=10`只是修改了`副本a`,`a`对象没有变化. 但是如果修改了`x.a=10`是修改了两者指向的同一堆内存,此时对象`a`也会受到影响.

要我说都是按值传递，只不过传对象有的时候一不小心碰到了共同的蛋糕(`同一堆内存`)，不开心了

## 闭包？
简单讲，闭包就是指有权访问另一个函数作用域中的变量的函数。

产生一个闭包
创建闭包最常见方式，就是在一个函数内部创建另一个函数。
```js
function fn(){
  var a = 1, b = 2;
  
  function closure(){
    return a + b;
  }
  return closure;
}
```
闭包的作用域链包含着它自己的作用域，以及包含它的函数的作用域和全局作用域。

产生的问题
- 通常，函数的作用域及其所有变量都会在函数执行结束后被销毁。但是，在创建了一个闭包以后，这个函数的作用域就会一直保存到闭包不存在为止。
```js
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

var add5 = makeAdder(5);
var add10 = makeAdder(10);

console.log(add5(2));  // 7
console.log(add10(2)); // 12

// 释放对闭包的引用
add5 = null;
add10 = null;
```

闭包中的this
```js
var name = "The Window";

var obj = {
  name: "My Object",
  
  getName: function(){
    return function(){
      return this.name;
    };
  }
};

console.log(obj.getName()());  // The Window
```
obj.getName()()实际上是在全局作用域中调用了匿名函数，this指向了window。

闭包应用
- 应用闭包的主要场合是：设计私有的方法和变量。
```js
function Animal(){
  
  // 私有变量
  var series = "哺乳动物";
  function run(){
    console.log("Run!!!");
  }
  
  // 特权方法
  this.getSeries = function(){
    return series;
  };
}
```
- 单例

普通模式
```js
var singleton = {
  name: "percy",
  speak:function(){
    console.log("speaking!!!");
  },
  getName: function(){
    return this.name;
  }
};
```

模块模式(闭包创建)

```js
var singleton = (function(){
  
  // 私有变量
  var age = 22;
  var speak = function(){
    console.log("speaking!!!");
  };
  
  // 特权（或公有）属性和方法
  return {
    name: "percy",
    getAge: function(){
      return age;
    }
  };
})();
```
- `匿名函数最大的用途是创建闭包`,并且还可以构建命名空间，以减少全局变量的使用。从而使用闭包模块化代码，减少全局变量的污染。
```js
var objEvent = objEvent || {};
(function(){ 
    var addEvent = function(){ 
      // some code
    };
    function removeEvent(){
      // some code
    }

    objEvent.addEvent = addEvent;
    objEvent.removeEvent = removeEvent;
})();
```
## 作用域

JavaScript属于静态作用域，即声明的作用域是根据程序正文在编译时就确定的，有时也称为词法作用域。
简而言之就是调用的时候一层一层往上找的过程，一直到window

## ES6模块与CommonJS模块有什么区别？
ES6 Module和CommonJS模块的区别：

- CommonJS是对模块的浅拷贝，ES6 Module是对模块的引用,即ES6 Module只存只读，不能改变其值，具体点就是指针指向不能变，类似const
- import的接口是read-only（只读状态），不能修改其变量值。 即不能修改其变量的指针指向，但可以改变变量内部指针指向,可以对commonJS对重新赋值（改变指针指向），但是对ES6 Module赋值会编译报错。

ES6 Module和CommonJS模块的共同点：

CommonJS和ES6 Module都可以对引入的对象进行赋值，即对对象内部属性的值进行改变。

## 类型转换的规则有哪些？
在if语句、逻辑语句、数学运算逻辑、==等情况下都可能出现隐士类型转换。

![类型转换](https://xiaomuzhu-image.oss-cn-beijing.aliyuncs.com/c378afab84afcdf430aec5229649faee.png)
```js
// ECMA-262, section 9.1, page 30. Use null/undefined for no hint,
// (1) for number hint, and (2) for string hint.
function ToPrimitive(x, hint) {  
  // Fast case check.
  if (IS_STRING(x)) return x;
  // Normal behavior.
  if (!IS_SPEC_OBJECT(x)) return x;
  if (IS_SYMBOL_WRAPPER(x)) throw MakeTypeError(kSymbolToPrimitive);
  if (hint == NO_HINT) hint = (IS_DATE(x)) ? STRING_HINT : NUMBER_HINT;
  return (hint == NUMBER_HINT) ? DefaultNumber(x) : DefaultString(x);
}

// ECMA-262, section 8.6.2.6, page 28.
function DefaultNumber(x) {  
  if (!IS_SYMBOL_WRAPPER(x)) {
    var valueOf = x.valueOf;
    if (IS_SPEC_FUNCTION(valueOf)) {
      var v = %_CallFunction(x, valueOf);
      if (IsPrimitive(v)) return v;
    }

    var toString = x.toString;
    if (IS_SPEC_FUNCTION(toString)) {
      var s = %_CallFunction(x, toString);
      if (IsPrimitive(s)) return s;
    }
  }
  throw MakeTypeError(kCannotConvertToPrimitive);
}

// ECMA-262, section 8.6.2.6, page 28.
function DefaultString(x) {  
  if (!IS_SYMBOL_WRAPPER(x)) {
    var toString = x.toString;
    if (IS_SPEC_FUNCTION(toString)) {
      var s = %_CallFunction(x, toString);
      if (IsPrimitive(s)) return s;
    }

    var valueOf = x.valueOf;
    if (IS_SPEC_FUNCTION(valueOf)) {
      var v = %_CallFunction(x, valueOf);
      if (IsPrimitive(v)) return v;
    }
  }
  throw MakeTypeError(kCannotConvertToPrimitive);
}
```

转换规则
1. 如果变量为字符串，直接返回.
2. 如果!IS_SPEC_OBJECT(x)，直接返回.
3. 如果IS_SYMBOL_WRAPPER(x)，则抛出异常.
4. 否则会根据传入的hint来调用DefaultNumber和DefaultString，比如如果为Date对象，会调用DefaultString.
5. DefaultNumber：首先x.valueOf，如果为primitive，则返回valueOf后的值，否则继续调用x.toString，如果为primitive，则返回toString后的值，否则抛出异常
6. DefaultString：和DefaultNumber正好相反，先调用toString，如果不是primitive再调用valueOf.

## 原型链

#### 原型对象
```js
var person = {
    name: "jojo",
    age: 18,
    profession: "我不想做人了"
  };
console.log(person.hasOwnProperty("name")); //true
console.log(person.hasOwnProperty("hasOwnProperty")); //false
console.log(Object.prototype.hasOwnProperty("hasOwnProperty")); //true
```
hasOwnProperty()方法可以访问自生属性，但是为什么可以访问hasOwnProperty(不在person中)这个属性呢，靠的就是原型链

![原型链](https://xiaomuzhu-image.oss-cn-beijing.aliyuncs.com/282ef60fe1dfe60924c6caeaeab6c550.png)

纳尼，看的头疼，要我说就是本身找不到就找别人(`prototype`)，靠媒介(`__proto__`),先后经历Object.prototype,Function.Type，知道找不到方向null

## this理解
1. 是否由箭头函数调用 ->指向箭头函数外层非箭头函数的this指向 ;
2. 是否由new调用 ->指向新创建的对象 ;
3. 是否由call || apply || bind 调用 -> 指向指定的对象 ;
4. 是否由对象调用 -> 指向这个对象 ;
5. 上面几种情况都不是：严格模式下指向undefined，非严格模式下指向全局对象

## async/await是什么？
async 函数，就是 Generator 函数的语法糖，它建立在Promises上，并且与所有现有的基于Promise的API兼容。

1. Async—声明一个异步函数(async function fn(){...})
- 自动将常规函数转换成Promise，返回值也是一个Promise对象
- 只有async函数内部的异步操作执行完，才会执行then方法指定的回调函数
- 异步函数内部可以使用await
2. Await—暂停异步的功能执行(var result = await apiFn()😉
- 放置在Promise调用之前，await强制其他代码等待，直到Promise完成并返回结果
- 只能与Promise一起使用，不适用与回调
- 只能在async函数内部使用

## async/await相比于Promise的优势？

- 代码读起来更加同步，Promise虽然摆脱了回调地狱，但是then的链式调用也会带来额外的阅读负担
- Promise传递中间值非常麻烦，而async/await几乎是同步的写法，非常优雅
- 错误处理友好，async/await可以用成熟的try/catch，Promise的错误捕获非常冗余
- 调试友好，Promise的调试很差，由于没有代码块，你不能在一个返回表达式的箭头函数中设置断点，如果你在一个.then代码块中使用调试器的步进(step-over)功能，调试器并不会进入后续的.then代码块，因为调试器只能跟踪同步代码的『每一步』。

## JavaScript中实现不可变对象？
实现不可变数据有三种主流的方法

1. 深克隆，但是深克隆的性能非常差，不适合大规模使用
2. Immutable.js，Immutable.js是自成一体的一套数据结构，性能良好，但是需要学习额外的API
3. immer，利用Proxy特性，无需学习额外的api，性能良好

