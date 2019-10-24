// 上一个示例有个很严重的问题是当store树很大的时候，
// 会变得很不好维护，所有的状态都在一个plan函数里，需要拆分（即是拆分reducer）
function createStore(reducer, initialState) {
    let state = initialState;
    let listeners = [];

    function substribe(listener) {
        listeners.push(listener);
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

    // 注意这里初始化触发dispatch，用一个不匹配任务计划的type来获取初始值
    dispatch({ type: Symbol() });

    return {
        substribe,
        dispatch,
        getState
    };
}

// 一个子reducer
function counterReducer(state = {count: 0}, action) {
    switch (action.type) {
        case 'INCREMENT':
            return {...state, count: state.count+1};
        case 'DECREMENT':
            return {...state, count: state.count-1};
        default:
            return state;
    }
}

// 一个子reducer
function infoReducer(state = {name: '', desc: ''}, action) {
    switch (action.type) {
        case 'CHANGE_NAME':
            return { ...state, name: action.info.name };
        case 'CHANGE_DESC':
            return { ...state, desc: action.info.desc };
        default:
            return state;
    }
}

/**
 *
 *
 * @param {*} reducers 多个reducer合成的对象
 * @returns 一个新的reducer函数
 */
function combineReducers(reducers) {
    // ['couter', 'info']
    let reducersKeys = Object.keys(reducers);

    // 返回一个新的reducer函数
    return function combination(state = {}, action) {
        // 生成新的state
        let nextState = {};
        for (let i = 0; i < reducersKeys.length; i++) {
            const key = reducersKeys[i];
            const reducer = reducers[key];
            // 获取旧state
            const prevStateForKey = state[key];
            // 获取经过新拆分reducer执行后得到的新state
            const nextStateForKey = reducer(prevStateForKey, action);
            nextState[key] = nextStateForKey;
        }
        return nextState;
    }
}

// 把多一个reducer函数合并成一个reducer函数
const reducers = combineReducers({
    counter: counterReducer,
    info: infoReducer
});

// 注意没有传入初始值（initialState）
let store = createStore(reducers);
console.dir(store.getState());

store.substribe(() => {
    console.log(`count: ${store.getState().counter.count}`);
});

store.substribe(() => {
    console.log(`info.name: ${store.getState().info.name}`, `info.desc: ${store.getState().info.desc}`);
});

// 自增
store.dispatch({
    type: 'INCREMENT'
});

// 自减
store.dispatch({
    type: 'DECREMENT'
});

// 随便改，得到默认的值
store.dispatch({
    type: 'ss'
});

// 改变名字
store.dispatch({
    type: 'CHANGE_NAME',
    info: {
        name: 'franki'
    }
});

// 改变描述
store.dispatch({
    type: 'CHANGE_DESC',
    info: {
        desc: 'handsome'
    }
});

// redux 已经部分完善了