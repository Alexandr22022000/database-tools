const calcStatus = require('../scripts/calcStatus');

module.exports = (structure, pool, callback) => {
    const isOk = {};
    let isClean = true;
    for (let key in structure) {
        isOk[key] = 0;
        isClean = false;
    }

    if (isClean) {
        callback({errors: 0, ok: 0});
    }

    for (let tablesKey in structure) {
        pool.query(`DELETE FROM ${tablesKey}`, (error) => {
            if (error) console.log(error);
            isOk[tablesKey] = !error ? 1 : -1;

            let isEnd = true;
            for (let key in isOk) {
                if (isOk[key] === 0) isEnd = false;
            }

            if (isEnd) {
                callback(calcStatus(isOk));
            }
        });
    }
};