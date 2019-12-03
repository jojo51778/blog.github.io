## useState原理

#### 初级版
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


