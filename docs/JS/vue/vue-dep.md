# 依赖收集

上篇响应式原理实现了一个updateView，模拟视图更新，如果是真实的视图更新的话，Vue采用的是`发布订阅模式`，`依赖收集`。

如下图：

![依赖收集](/yilaishouji.webp)

## 订阅者Dep

订阅者主要是来放Watcher观察者对象的

```js
class Dep {
    constructor () {
        // 用来存放Watcher对象的数组
        this.subs = [];
    }

    // 在subs中添加一个Watcher对象
    addSub (sub) {
        this.subs.push(sub);
    }

    // 通知所有Watcher对象更新视图
    notify () {
        this.subs.forEach((sub) => {
            sub.update();
        })
    }
}
```

## 观察者 Watcher
```js
class Watcher {
    constructor () {
        // 在new一个Watcher对象时将该对象赋值给Dep.target，在get中会用到 
        Dep.target = this;
    }

    // 更新视图的方法
    update () {
        console.log("视图更新");
    }
}

Dep.target = null;
```

## 依赖收集

依赖收集的话就需要改下`defineReactive`以及`Vue构造函数`

```js
function defineReactive(target,key,value){
    // 订阅者对象
    const dep = new Dep();
    observer(value);
    Object.defineProperty(target,key,{
        get(){
            // 收集目标订阅者
            dep.addSub(Dep.target);
            return value 
        },
        set(newValue){
            if(newValue !== value){
                observer(newValue) 
                // 通知所有观察者对象更新
                dep.notify();
                value = newValue
            }
        }
    });
}

class Vue {
    constructor(options) {
        this._data = options.data;
        observer(this._data);
        // 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象
        new Watcher();
        // 模拟render的过程，为了触发test属性的get函数
        console.log('render', this._data.test);
    }
}
```