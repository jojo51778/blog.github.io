# redux状态管理器

redux 是一个状态管理器，状态就是数据，比如计数器中的 count。
```js
let state = {
  count: 1
}
```
使用状态就是`state.count`, 修改状态就是`state.count=2`

我们的目的最终还是显示到视图上，所以我们需要通知视图更新，我们可以采用发布-订阅模式来解决这个问题

```js
let state = {
  count: 1
};
let listeners = [];

// 订阅
function subscribe(listener) {
  listeners.push(listener);
}

function changeCount(count) {
  state.count = count;
  // 当 count 改变的时候，通知所有的订阅者
  listeners.forEach(listener => listener());
}
```
使用一下
```js
//订阅一下，当 count 改变的时候，我要实时输出新的值
subscribe(() => {
  console.log(state.count);
});

// 我们来修改下 state，当然我们不能直接去改 state 了，我们要通过 changeCount 来修改
changeCount(2); // 2
changeCount(3); // 3
changeCount(4); // 4
```
现在有两个新的问题摆在我们面前

- 这个状态管理器只能管理 count，不通用
- 公共的代码要封装起来

所以来提取公共代码
```js
const createStore = function (initState) {
  let state = initState;
  let listeners = [];

  // 订阅
  function subscribe(listener) {
    listeners.push(listener);
  }

  function changeState(newState) {
    state = newState;
    // 通知
    listeners.forEach(listener => listener());
  }

  function getState() {
    return state;
  }

  return {
    subscribe,
    changeState,
    getState
  }
}
```