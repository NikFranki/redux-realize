// loggerMiddleware
const loggerMiddleware = store => next => action => {
    console.log('cur state: ', store.getState());
    console.log('action: ', action);
    next(action);
    console.log('new state: ', store.getState());
};

module.exports = loggerMiddleware;
