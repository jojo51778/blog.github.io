import { createStore, combineReducers, applyMiddleware } from './redux';
import counterReducer from './reducers/counter';
import infoReducer from './reducers/info';

import loggerMiddleware from './middlewares/loggerMiddleware';
import exceptionMiddleware from './middlewares/exceptionMiddleware';
import timeMiddleware from './middlewares/timeMiddleware';


const reducer = combineReducers({
  counter: counterReducer
});

/*接收旧的 createStore，返回新的 createStore*/
const rewriteCreateStoreFunc = applyMiddleware(exceptionMiddleware, timeMiddleware, loggerMiddleware);

/*返回了一个 dispatch 被重写过的 store*/
const store = createStore(reducer, {}, rewriteCreateStoreFunc);

/*replaceReducer*/
const nextReducer = combineReducers({
    counter: counterReducer,
    info: infoReducer
});
  
store.replaceReducer(nextReducer);

store.subscribe(() => {
  let state = store.getState();
  console.log(state.counter.count);
});


const unsubscribe = store.subscribe(() => {
    let state = store.getState()
    console.log(state.counter.count)
})

unsubscribe()



/*自增*/
store.dispatch({
  type: 'INCREMENT'
});
store.dispatch({
  type: 'DECREMENT'
});