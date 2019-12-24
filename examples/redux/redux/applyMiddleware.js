import compose from './compose'

const applyMiddleware = function (...middlewares) {
    return function rewriteCreateStoreFunc(oldCreateStore) {
        return function newCreateStore(reducer, initState) {
            const store = oldCreateStore(reducer, initState)
            const simpleStore = { getState: store.getState }
            const chain = middlewares.map(middleware => middleware(simpleStore))
            // let dispatch = store.dispatch;
            // /* 实现 exception(time((logger(dispatch))))*/
            // chain.reverse().map(middleware => {
            //     dispatch = middleware(dispatch);
            // });

            // /*2. 重写 dispatch*/
            // store.dispatch = dispatch;
            const dispatch = compose(...chain)(store.dispatch)
            return {
                ...store,
                dispatch
            }
        }
    }
}
export default applyMiddleware