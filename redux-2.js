// 解决上个例子的不足（只可以控制count，不通用， 公共代码直接暴露，容易被修改）

// 下面尝试封装一下
function createStore(initState) {
    let state = initState;
    let listeners = [];

    /* 订阅 */
    function substribe(listener) {
        listeners.push(listener);
    }

    function changeState(newState) {
        state = newState;
        /* 通知 */
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

// test
let initState = {
    counter: {
        count: 0
    },
    info: {
        name: '',
        desc: '',
    }
};

let store = createStore(initState);

store.substribe(() => {
    let state = store.getState();
    console.log('count: ', state.counter.count);
});

store.substribe(() => {
    let state = store.getState();
    console.log(
        `info.name: ${state.info.name}`,
        `info.desc: ${state.info.desc}`
    );
});

store.changeState({
    ...store.getState(),
    counter: { count: 1 }
});

store.changeState({
    ...store.getState(),
    info: {name: 'franki', desc: 'handsome boy'}
});

// 到这里，已经完成了一个初步的状态管理器