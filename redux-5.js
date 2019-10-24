//redux 中间件处理
const applyMiddleware = require('./middleware/applyMiddleware');
const loggerMiddleware = require('./middleware/loggerMiddleware');
const execptionMiddleware = require('./middleware/execptionMiddleware');
const timeMiddleware = require('./middleware/timeMiddleware');

function createStore(reducer, initialState, reWriteCreateStoreFunc) {
    if (typeof initialState === 'function') {
        reWriteCreateStoreFunc = initialState;
        initialState = undefined;
    }
    // 如果有reWriteCreateStoreFunc，就采用新的createStore
    if (reWriteCreateStoreFunc) {
        const newCreateStore = reWriteCreateStoreFunc(createStore);
        return newCreateStore(reducer, initialState);
    }

    let state = initialState;
    let listeners = [];


    function substribe(listener) {
        listeners.push(listener);
        // 增加退订方法
        return function unsubstribe() {
            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
        }
    }

    function dispatch(action) {
        state = reducer(state, action);
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }
    }

    function getState(params) {
        return state;
    }

    function replaceReducer(newReducer) {
        // 把新reducer赋予旧的reducer达到替换的效果
        reducer = newReducer;
        // 重新dispatch达到更换效果
        dispatch({type: Symbol()});
    }

    dispatch({type: Symbol()})

    return {
        substribe,
        dispatch,
        getState,
        replaceReducer
    };
}

function counterReducer(state = {count: 0}, action) {
    switch (action.type) {
        case 'INCREMENT':
            return {...state, count: state.count + 1};
        case 'DECREMENT':
            return {...state, count: state.count - 1};
        default:
            return state;
    }
}

function infoReducer(state = {name: '', desc: ''}, action) {
    switch (action.type) {
        case 'CHANGE_NAME':
            return {...state, name: action.payload.name};
        case 'CHANGE_DESC':
            return {...state, desc: action.payload.desc};
        default:
            return state;
    }
}

function combineReducers(reducers) {
    const reducersKeys = Object.keys(reducers);

    return function combination(state = {}, action) {
        let nextState = {};
        for (let i = 0; i < reducersKeys.length; i++) {
            const key = reducersKeys[i];
            const reducer = reducers[key];
            const prevStateForKey = state[key];
            const nextStateForKey = reducer(prevStateForKey, action);
            nextState[key] = nextStateForKey;
        }
        return nextState;
    }
}

const reducers = combineReducers({
    counter: counterReducer,
    info: infoReducer
});

const reWriteCreateStoreFunc = applyMiddleware(loggerMiddleware, execptionMiddleware, timeMiddleware);
const store = createStore(reducers, reWriteCreateStoreFunc);
// const next = store.dispatch;

// const logger = loggerMiddleware(store);
// const execption = execptionMiddleware(store);
// const time = timeMiddleware(store);
// store.dispatch = execption(time(logger(next)));


store.substribe(() => {
    console.log(`count: ${store.getState().counter.count}`);
});

const unsubstribe = store.substribe(() => {
    console.log(
        `info.name: ${store.getState().info.name}`,
        `info.desc: ${store.getState().info.desc}`
    );
});
unsubstribe();

store.dispatch({type: 'INCREMENT'});

store.dispatch({ type: 'DECREMENT' });

store.dispatch({ type: 'CHANGE_NAME', payload: {name: 'franki'} });

store.dispatch({ type: 'CHANGE_DESC', payload: { desc: 'very handsome' } });

// 生成新的reducer并替换掉旧的reducer
const newReducers = combineReducers({
    counter: counterReducer,
});

store.replaceReducer(newReducers);

store.dispatch({ type: 'INCREMENT' });


// 到此为止，整个redux总体完成
// 详细说说几个重要的名词
// createStore 创建store对象，包含substribe dispatch getState replaceReducer
// reducer 是一个计划函数，接收旧state 和 action，用于改变state树
// dispatch 用于触发action，生成新state
// substribe 订阅功能，每次触发dispatch的时候，会执行订阅函数
// combineReducers 将多个reducer合并成一个reducer
// replaceReducer 替换 reducer 函数
// middleware 用于扩展dispatch方法


// redux 大概流程为 views > store.dispatch > store (reducer state) > views