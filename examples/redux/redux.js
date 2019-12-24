// let state = {
//   count: 1
// };
// let listeners = [];

// // 订阅
// function subscribe(listener) {
//   listeners.push(listener);
// }

// function changeCount(count) {
//   state.count = count;
//   // 当count改变的时候，我们需要通知所有的订阅者
//   for (let i = 0; i < listeners.length; i++) {
// 		const listener = listeners[i]
// 		listener()
// 	}
// }

// subscribe(() => {
// 	console.log(state.count)
// })

// changeCount(2)
// changeCount(3)

// 上面代码不通用只适用于管理count

// 封装公共代码


// let initState = {
// 	counter: {
// 		count: 0
// 	},
// 	info: {
// 		name: '',
// 		description: ''
// 	}
// }

// let store = createStore(initState)

// store.subscribe(() => {
// 	let state = store.getState()
// 	console.log(`${state.info.name}: ${state.info.description}`)
// })

// store.subscribe(() => {
// 	let state = store.getState()
// 	console.log(state.counter.count)
// })

// store.dispatch({
// 	...store.getState(),
// 	info: {
// 		name: 'jojo',
// 		description: '我不做人了'
// 	}
// })

// store.dispatch({
// 	...store.getState(),
// 	counter: {
// 		count: 1
// 	}
// })

// let initState = {
//   count: 0
// }
// let store = createStore(initState);

// store.subscribe(() => {
//   let state = store.getState();
//   console.log(state.count);
// });
// /*自增*/
// store.dispatch({
//   count: store.getState().count + 1
// });
// /*自减*/
// store.dispatch({
//   count: store.getState().count - 1
// });
// /*我想随便改*/
// store.dispatch({
//   count: 'abc'
// });

const createStore = function(reducer, initState) {
	let state = initState
	let listeners = []
	// 订阅
	function subscribe(listener) {
		listeners.push(listener)
	}

	function dispatch(action) {
		// 按照计划修改state
		state = reducer(state, action)
		//通知
		for (let i = 0; i < listeners.length; i++) {
			const listener = listeners[i]
			listener()
		}
	}
	function getState() {
		return state
	}
	dispatch({ type: Symbol() })

	return {
		subscribe,
		dispatch,
		getState
	}
}

function combineReducers(reducers) {
	// reducer数组
	const reducerKeys = Object.keys(reducers)

	// 返回合并后的reducer函数
	return function combination(state = {}, action) {
		// 生成新的state
		const nextState = {}

		for(let i = 0; i < reducerKeys.length; i++) {
			const key = reducerKeys[i]
			const reducer = reducers[key]

			// 之前key的state
			const previousStateForKey = state[key]
			// 执行分reducer，获得新的state
			const nextStateForKey = reducer(previousStateForKey, action)

			nextState[key] = nextStateForKey
		}
		return nextState
	}
}
let initState = {
	count: 0
}
function counterReducer(state, action) {
	if (!state) {
		state = initState
	}
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1
      }
    default:
      return state;
  }
}

// const reducer = combineReducers({
//   counter: counterReducer,
//   info: InfoReducer
// });

let store = createStore(counterReducer);
const next = store.dispatch


// 重写dispatch
store.dispatch = action => {
	try {
		console.log('this state', store.getState());
    console.log('action', action);
    next(action);
    console.log('next state', store.getState());
	} catch (err) {
		console.error('错误报告', err)
	}
}

store.dispatch({
  type: 'INCREMENT'
});