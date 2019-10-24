// timeMiddleware
const timeMiddleware = store => next => action => {
    console.log('cur time: ', new Date().getTime());
    next(action);
};

module.exports = timeMiddleware;
