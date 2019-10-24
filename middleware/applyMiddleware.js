// 目的是返回一个dispatch被重写了新的store
function applyMiddleware(...middlewares) {
    // 返回一个重写的createStore
    return function reWriteCreateStoreFunc(oldCreateStore) {
        // 返回一个新的createStore
        return function newCreateStore(reducer, initialState) {
            // 生成store
            const store = oldCreateStore(reducer, initialState);
            let dispatch = store.dispatch;
            
            // 按照最小开放原则，只想让中间件拥有store.getState权利
            const simpleStore = {getState: store.getState}
            // 给每一个middleware传一个store，相当于 const logger = loggerMiddleware(store);
            // [execption, time, logger]
            const chain = middlewares.map(middleware => {
                return middleware(simpleStore);
            });

            // chain.reverse().map(middleware => {
            //     dispatch = middleware(dispatch);
            // });
            dispatch = compose(...chain)(dispatch);

            store.dispatch = dispatch;
            return store;
        };
    };
}

function compose(...funcs) {
    if (funcs.length === 1) {
        return funcs[0];
    }
    return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

module.exports = applyMiddleware;
