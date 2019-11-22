# 动不动手写系列
## 实现防抖函数（debounce）

防抖函数原理：它是维护一个计时器,`delay`(延迟)时间后出过事事件处理函数,但是在`delay`时间内再次触发的话,都会清除当前的timer重新计时,这样一来,只有最后一次操作事件处理函数才被真正的触发

应用场景: 按钮`多次点击`，常应用于输入框事件`keydown`,`keyup`,`搜索联想查询`,只有在用户停止键盘输入时,才发送Ajax请求
```js
const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    //再次进来就清除定时器
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
```

## 实现节流函数（throttle）
节流原理: 通过判断是否达到一定的时间来触发函数,若没有规定时间则使用计时器进行延迟,而下一次事件则会重新设定计时器,它是间隔时间执行

应用场景: 鼠标移动`mousemove`,拖拽,窗口尺寸改动(`resize`),鼠标滚轮页面上拉(`onScroll`),`上拉刷新`懒加载

```js
const throttle = (fn, delay = 500) => {
  // 当前时间间隔内是否有方法执行,设置一个开关标识
  let flag = false;
  return (...args) => {
    // 判断当前是否有方法执行,有则什么都不做,若为true,则跳出
    if (flag) return;
    flag = true;
    // 添加定时器,在到达时间间隔时重置锁的状态
    setTimeout(() => {
      fn.apply(this, args);
      // 执行完毕后,声明当前没有正在执行的方法,方便下一个时间调用
      flag = false;
    }, delay);
  };
};
```

ps: 其实防抖节流都是`闭包`进行保存变量第二次访问还能读取到变量成功达到效果

# 深克隆（deepclone）
简单的深克隆：
```js
const newObj = JSON.parse(JSON.stringify(oldObj));
```

局限性：
1. 他无法实现对函数 、RegExp等特殊对象的克隆
2. 会抛弃对象的constructor,所有的构造函数会指向Object
3. 对象有循环引用,会报错

真正的深克隆：

```js
const clone = parent => {
  // 判断类型
  const isType = (obj, type) => {
    if (typeof obj !== "object") return false;
    const typeString = Object.prototype.toString.call(obj);
    let flag;
    switch (type) {
      case "Array":
        flag = typeString === "[object Array]";
        break;
      case "Date":
        flag = typeString === "[object Date]";
        break;
      case "RegExp":
        flag = typeString === "[object RegExp]";
        break;
      default:
        flag = false;
    }
    return flag;
  };

  // 处理正则
  const getRegExp = re => {
    var flags = "";
    if (re.global) flags += "g";
    if (re.ignoreCase) flags += "i";
    if (re.multiline) flags += "m";
    return flags;
  };
  // 维护两个储存循环引用的数组
  const parents = [];
  const children = [];

  const _clone = parent => {
    if (parent === null) return null;
    if (typeof parent !== "object") return parent;

    let child, proto;

    if (isType(parent, "Array")) {
      // 对数组做特殊处理
      child = [];
    } else if (isType(parent, "RegExp")) {
      // 对正则对象做特殊处理
      child = new RegExp(parent.source, getRegExp(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (isType(parent, "Date")) {
      // 对Date对象做特殊处理
      child = new Date(parent.getTime());
    } else {
      // 处理对象原型
      proto = Object.getPrototypeOf(parent);
      // 利用Object.create切断原型链
      child = Object.create(proto);
    }

    // 处理循环引用
    const index = parents.indexOf(parent);

    if (index != -1) {
      // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
      return children[index];
    }
    parents.push(parent);
    children.push(child);

    for (let i in parent) {
      // 递归
      child[i] = _clone(parent[i]);
    }

    return child;
  };
  return _clone(parent);
};
```

其实这些还不够，一些特殊情况没有处理: 例如Buffer对象、Promise、Set、Map，想要真正的实现还是要看loadsh

## 实现instanceOf
用法：判断实例是不是某个构造函数的实例

实现：
```js
function instance_of(L, R) {
  //L 表示左表达式，R 表示右表达式
  var O = R.prototype; // 取 R 的显示原型
  L = L.__proto__; // 取 L 的隐式原型
  while (true) {
    if (L === null) return false;
    if (O === L)
      // 这里重点：当 O 严格等于 L 时，返回 true
      return true;
    L = L.__proto__;
  }
}
```

## 模拟new
- 它创建了一个全新的对象
- 它会被执行`[[Prototype]]`（也就是`__proto__`）链接
- 它使`this`指向`新创建`的对象
- 通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上
- 如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么new表达式中的函数调用将返回该对象引用
```js
function objectFactory() {
  const obj = new Object();
  // 截取第一个参数作为构造器
  const Constructor = [].shift.call(arguments);

  // 创建原型链
  obj.__proto__ = Constructor.prototype;

  const ret = Constructor.apply(obj, arguments);

  return typeof ret === "object" ? ret : obj;
}
```

## 实现call
- 将函数设为对象的属性
- 执行&删除这个函数
- 指定this到函数并传入给定参数执行函数
- 如果不传入参数，默认指向为 window
```js
Function.prototype.myCall = function(context) {
  //此处没有考虑context非object情况
  context.fn = this;
  let args = [];
  for (let i = 1, len = arguments.length; i < len; i++) {
    args.push(arguments[i]);
  }
  context.fn(...args);
  let result = context.fn(...args);
  delete context.fn;
  return result;
};
```

## 实现apply
唯一不同的是参数接收的是数组
```js
Function.prototype.myapply = function(context, arr) {
  var context = Object(context) || window;
  context.fn = this;

  var result;
  if (!arr) {
    result = context.fn();
  } else {
    var args = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push("arr[" + i + "]");
    }
    result = eval("context.fn(" + args + ")");
  }

  delete context.fn;
  return result;
};
```

## 实现 bind

- 返回一个函数，`绑定this`，传递`预置参数`
- bind返回的函数可以作为构造函数使用。故作为构造函数时应使得this失效，但是传入的参数依然有效

```js
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
          return fToBind.apply(this instanceof fBound
                 ? this
                 : oThis,
                 // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    // 维护原型关系
    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype; 
    }
    // 下行的代码使fBound.prototype是fNOP的实例,因此
    // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
    fBound.prototype = new fNOP();

    return fBound;
  };
}
```
## 实现Object.create

Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。

```js
if (!Object.create) {
  Object.create = function(proto) {
    function F() {}
    F.prototype = proto
    return new F()
  }
}
```

## 实现类的继承

```js
function Parent(name) {
    this.parent = name
}
Parent.prototype.say = function() {
    console.log(`${this.parent}: 你打篮球的样子像kunkun`)
}
function Child(name, parent) {
    // 将父类的构造函数绑定在子类上
    Parent.call(this, parent)
    this.child = name
}

/** 
 1. 这一步不用Child.prototype =Parent.prototype的原因是怕共享内存，修改父类原型对象就会影响子类
 2. 不用Child.prototype = new Parent()的原因是会调用2次父类的构造方法（另一次是call），会存在一份多余的父类实例属性
3. Object.create是创建了父类原型的副本，与父类原型完全隔离
*/
Child.prototype = Object.create(Parent.prototype);
Child.prototype.say = function() {
    console.log(`${this.parent}好，我是练习时长两年半的${this.child}`);
}

// 注意记得把子类的构造指向子类本身
Child.prototype.constructor = Child;

var parent = new Parent('father');
parent.say() // father: 你打篮球的样子像kunkun

var child = new Child('cxk', 'father');
child.say() // father好，我是练习时长两年半的cxk
```

## 实现event bus，实现Promise
