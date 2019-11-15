# Vue响应式数据原理2.0

## Object.defineProperty
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