## hooks原理

## useState原理
```js
function useState(initialValue) {
  let _val = initialValue // 初始值
  function state() {
    return _val
  }
  function setState(newVal) {
    _val = newVal //新值赋值
  }
  return [state, setState]
}
// 测试useState
const [count, setCount] = useState(0)
console.log(count())
setCount(1)
console.log(count())
```
组件中用法

```js
function Counter() {
  const [count, setCount] = useState(0)
  return {
    click: () => setCount(count() + 1),
    render: () => console.log('render:', { count: count() })
  }
}
const C = Counter()
C.render() // render: { count: 0 }
C.click()
C.render() // render: { count: 1 }
```

#### 进阶版

```js
//使用闭包看起来像是react中的用法,且保存变量
const React = (function() {
  let _val
  return {
    render(Component) {
      const Comp = Component()
      Comp.render()
      return Comp
    },
    useState(initialValue) {
      _val = _val || initialValue
      function setState(newVal) {
        _val = newVal
      }
      return [_val, setState]
    }
  }
})()

function Counter2() {
  const [count, setCount] = React.useState(0)
  return {
    click: () => setCount(count + 1),
    render: () => console.log('render:', { count })
  }
}
let App
App = React.render(Counter2) // render: { count: 0 }
App.click()
App = React.render(Counter2) // render: { count: 1 }
```

## useEffect原理

```js
const MyReact = (function() {
  let _val, _deps // _deps变量跟踪
  return {
    render(Component) {
      const Comp = Component()
      Comp.render()
      return Comp
    },
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray // 空数组时
      // 所有变量没变化时返回false
      const hasChangedDeps = _deps ? !depArray.every((el, i) => el === _deps[i]) : true
      if (hasNoDeps || hasChangedDeps) {
        callback()
        _deps = depArray
      }
    },
    useState(initialValue) {
      _val = _val || initialValue
      function setState(newVal) {
        _val = newVal
      }
      return [_val, setState]
    }
  }
})()

// usage
function Counter() {
  const [count, setCount] = MyReact.useState(0)
  MyReact.useEffect(() => {
    console.log('effect', count)
  }, [count])
  return {
    click: () => setCount(count + 1),
    noop: () => setCount(count),
    render: () => console.log('render', { count })
  }
}
let App
App = MyReact.render(Counter)
// effect 0
// render {count: 0}
App.click()
App = MyReact.render(Counter)
// effect 1
// render {count: 1}
App.noop()
App = MyReact.render(Counter)
// // no effect run
// render {count: 1}
App.click()
App = MyReact.render(Counter)
// effect 2
// render {count: 2}
```

上面的代码大底实现了effect，但是却存在一个复用问题，解决方法

```js
const MyReact = (function() {
  let hooks = [],
    currentHook = 0 // hooks数组以及索引
  return {
    render(Component) {
      const Comp = Component()
      Comp.render()
      currentHook = 0 // 重置，下次渲染
      return Comp
    },
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray
      const deps = hooks[currentHook] // 类型可能是数组或者undefind
      const hasChangedDeps = deps ? !depArray.every((el, i) => el === deps[i]) : true
      if (hasNoDeps || hasChangedDeps) {
        callback()
        hooks[currentHook] = depArray
      }
      currentHook++ // 执行结束
    },
    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue
      const setStateHookIndex = currentHook // 保存变量给setState用
      const setState = newState => (hooks[setStateHookIndex] = newState)
      return [hooks[currentHook++], setState]
    }
  }
})()
```