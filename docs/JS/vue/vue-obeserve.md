# Vue响应式数据原理

## Vue2.0 Object.defineProperty
数据模型仅仅是普通的 `JavaScript` 对象，但是对这些对象进行操作时，却能影响对应视图，简而言之，就是`你动我也动`。
它的核心实现就是「**响应式系统**」,核心内容为[Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
使用方法如下:
```js
/*
    obj: 目标对象
    prop: 目标对象的属性名
    descriptor: 描述符
    
    return value 传入对象
*/
Object.defineProperty(obj, prop, descriptor)
```
descriptor的一些属性

- enumerable，属性是否可枚举，默认 false。
- configurable，属性是否可以被修改或者删除，默认 false。
- get，获取属性的方法。
- set，设置属性的方法。

## 实现 `observer`（可观察到你动了）

首先定义一个假的函数来模拟更新
```js
function updateView(val) {
    /* 假装是视图 */
    console.log("我动了");
}
```
然后我们定义一个 `defineReactive` ，这个方法通过 `Object.defineProperty` 来实现对对象的「响应式」化，经过 `defineReactive` 处理以后，我们的 target 的 key 属性在「**读**」的时候会触发 `get` 方法，而在该属性被「**写**」的时候则会触发 `set` 方法。

```js
function defineReactive (target, key, val) {
    Object.defineProperty(obj, key, {
        get() {
            return val;
        },
        set(newVal) {
            if (newVal === val) return;
            updateView(newVal);
        }
    });
}
```
这样貌似ok了，但是没人让他动起来，我们再封装一层`observer`,这个函数传入一个 value（需要「响应式」化的对象），通过遍历所有属性的方式对该对象的每一个属性都通过 defineReactive 处理。
```js
function observer (target) {
    if (!target || (typeof target !== 'object')) {
        return;
    }
    
    Object.keys(target).forEach((key) => {
        defineReactive(target, key, target[key]);
    });
}
```
最后为了好看点，封装一个Vue
```js
class Vue {
    constructor(options) {
        this._data = options.data;
        observer(this._data);
    }
}
// 测试
let o = new Vue({
    data: {
        test: "I am test."
    }
});
o._data.test = "hello,world.";  /* 我动了 */
``` 
## 问题来了 
#### 1，这只测试了字符串，要是测试`嵌套对象`就很容易发现问题，不动啦，原理也很简单，指向同一内存，可以类比深浅拷贝

那么我们要进行`递归调用`
```js
function defineReactive(target, key, value){
    observer(value); // 递归 我就将这个对象 继续拦截
    Object.defineProperty(target,key,{
        get(){
            return value 
        },
        set(newValue){
            if(newValue !== value){ // 不同值才更新
                observer(newValue)  // o_data.age = {n:200};o _data.age.n = 300;这种情况就需要重新观察
                updateView();
                value = newValue
            }
        }
    });
}
```
#### 2，新加数组项不会触发更新

改写`observer`, 为了让`不改变原数组`，巧妙运用切片编程
```js
let oldArrayPrototype = Array.prototype;
let proto = Object.create(oldArrayPrototype); // 继承
['push','shift','unshift'].forEach(method=>{
    proto[method] = function(){ //函数劫持 把函数进行重写 内部 继续调用老的方法
        updateView(); // 切片编程
        oldArrayPrototype[method].call(this, ...arguments)
        // oldArrayPrototype[method].apply(this, arguments)
    }
});
function observer(target){
    if(typeof target !== 'object' || target == null){
        return target;
    }
    if(Array.isArray(target)){ // 拦截数组 给数组的方法进行了重写 
        Object.setPrototypeOf(target,proto); // 写个循环 赋予给target
        // target.__proto__ = proto;
        for(let i = 0; i< target.length ;i++){
            observer(target[i]);
        }
    }else{
        Object.keys(target).forEach((key) => {
            defineReactive(target, key, target[key]);
        });
    }
   
}
```
#### 3，新增的属性不更新，使用$set啦

## 整合代码如下

```js
let oldArrayPrototype = Array.prototype;
let proto = Object.create(oldArrayPrototype); // 继承
['push','shift','unshift'].forEach(method=>{
    proto[method] = function(){ //函数劫持 把函数进行重写 内部 继续调用老的方法
        updateView(); // 切片编程
        oldArrayPrototype[method].call(this,...arguments)
    }
});
function observer(target){
    if(typeof target !== 'object' || target == null){
        return target;
    }
    if(Array.isArray(target)){ // 拦截数组 给数组的方法进行了重写 
        Object.setPrototypeOf(target,proto); // 写个循环 赋予给target
        // target.__proto__ = proto;
        for(let i = 0; i< target.length ;i++){
            observer(target[i]);
        }
    }else{
        Object.keys(target).forEach((key) => {
            defineReactive(target, key, target[key]);
        });
    }
   
}
function defineReactive(target,key,value){
    observer(value); // 递归 我就将这个对象 继续拦截
    Object.defineProperty(target,key,{
        get(){ // get 中会进行依赖收集
            return value 
        },
        set(newValue){
            if(newValue !== value){
                // data.age = {n:200}; data.age.n = 300;这种情况就需要重新观察
                observer(newValue) 
                updateView()
                value = newValue
            }
        }
    });
}
function updateView(){
    console.log('我动啦')
}

class Vue {
    constructor(options) {
        this._data = options.data;
        observer(this._data);
    }
}
// 测试
let o = new Vue({
    data: {
        test: "I am test."
    }
});
o._data.test = "hello,world.";  /* 我动了 */

```

## Proxy 面向3.0的数据响应式

Proxy比较简单，可直接监听对象，文档可参照[此处](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy),详细可参考阮大师的[es6 proxy](http://es6.ruanyifeng.com/#docs/proxy)

具体简单实现如下:

```js
let toProxy = new WeakMap(); // 弱引用映射表 放置的是 原对象:代理过的对象
let toRaw  = new WeakMap(); // 被代理过的对象:原对象
function isObject(val){
    return typeof val === 'object' && val !== null;
}
function hasOwn(target,key){
    return target.hasOwnProperty(key);
}
// 1.响应式的核心方法
function reactive(target){
    // 创建响应式对象 
    return createReativeObject(target);
}
// 创建响应式对象的
function createReativeObject(target){
    if(!isObject(target)){ // 如果当前不是对象 直接返回即可
        return target;
    }
    let proxy = toProxy.get(target); // 如果已经代理过了 就将代理过的结果返回即可
    if(proxy){
        return proxy;
    }
    if(toRaw.has(target)){ // 放置代理的过的对象再次被代理
        return target;
    }
    let baseHandler = { 
        // reflect 优点 不回报错 而且 会有返回值 会替代掉Object 上的方法
        get(target,key,receiver){
            // proxy + reflect 反射，获取值
            let result = Reflect.get(target,key,receiver);

            return isObject(result)?reactive(result):result; // 是个递归
        },
        set(target,key,value,receiver){ // [1,2,3,4]
            // 怎么去 识别是改属性 还是 新增属性
            let hadKey = hasOwn(target,key); // 判断这个属性 以前有没有
            let oldValue = target[key];
            let res = Reflect.set(target,key,value,receiver);
            if(!hadKey){
                console.log('添加新对象');
            }else if(oldValue !== value){ // 这里表述属性 更改过了
                console.log('设置新对象');
            }
            return res;
        },
        deleteProperty(target,key){
            let res = Reflect.deleteProperty(target,key)
            console.log('删除')
            return res;
        }
    }
    let observed = new Proxy(target,baseHandler); //es6
    toProxy.set(target,observed);
    toRaw.set(observed,target);
    return observed;
}
```

很明显，对于新添加的值proxy支持的很好，不用$set也不用重写数组方法，很好的体现了优势，唯一缺点就是兼容性差，不支持ie11，未来可期，预计3.0会兼容，两个各写一套。