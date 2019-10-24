// execptionMiddleware
const execptionMiddleware = store => next => action => {
    try {
        next(action);
    } catch (err) {
        console.err('error appearence: ', err);
    }
};

module.exports = execptionMiddleware;
