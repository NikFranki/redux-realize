// 初级redux状态管理器

/* couter 的发布订阅实践 */
let state = {
    count: 1
};

let listeners = [];

// 订阅
function substribe(listener) {
    listeners.push(listener);
}

function changeCount(count) {
    state.count = count;
    for (let i=0; i < listeners.length; i++) {
        const listener = listeners[i];
        listener();
    }
}

// test
// 订阅一下，当count改变的时候，我要实时输出新的值
substribe(() => {
    console.log(state.count);
});

// 修改state，通过changeCount来改变
changeCount(2);
changeCount(3);
changeCount(4);

