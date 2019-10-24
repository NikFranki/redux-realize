/**
 *
 * @param {*} plan 告诉store按照计划修改来修改state
 * @param {*} initialState 初始状态
 * @returns
 */
function createStore(plan, initialState) {
    let state = initialState;
    let listeners = [];

    function substribe(listener) {
        listeners.push(listener);
    }

    function changeState(action) {
        // 按照计划来修改state
        state = plan(state, action);
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }
    }

    function getState() {
        return state;
    }

    return {
        substribe,
        changeState,
        getState
    };
}

// 注意action = {type: '', other: ''}必须有个type属性
function plan(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return {...state, count: state.count+1};
        case 'DECREMENT':
            return { ...state, count: state.count-1 };
        default:
            return state;
    }
}

let initialState = {count: 0};

let store = createStore(plan, initialState);

store.substribe(() => {
    console.log(`count: ${store.getState().count}`);
});

// 自增
store.changeState({type: 'INCREMENT'});

// 自减
store.changeState({ type: 'DECREMENT' });

// 到此，一个初步的redux已经完成，为了逼格更高，可以把plan改为reducer, changeState改为dispatch