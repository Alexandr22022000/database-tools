const calcStatus = require('../scripts/calcStatus');

module.exports = (data, pool, callback) => {
    const isOk = {};
    let isClean = true;
    for (let tKey in data) {
        isOk[tKey] = [];
        for (let dKey in data[tKey]) {
            isClean = false;
            isOk[tKey].push(0);
        }
    }

    if (isClean) {
        callback({errors: 0, ok: 0});
    }

    for (let tablesKey in data) {
        for (let dataKey in data[tablesKey]) {
            let queryParamNames = '', queryParamNumbers = '', queryData = [], i = 1;
            for (let queryKey in data[tablesKey][dataKey]) {
                queryParamNames += `${queryKey}, `;
                queryParamNumbers += `$${i}, `;
                i++;
                queryData = [...queryData, data[tablesKey][dataKey][queryKey]];
            }
            queryParamNames = queryParamNames.substring(0, queryParamNames.length - 2);
            queryParamNumbers = queryParamNumbers.substring(0, queryParamNumbers.length - 2);

            pool.query(`INSERT INTO ${tablesKey}(${queryParamNames}) VALUES(${queryParamNumbers})`, queryData,(error) => {
                if (error) console.log(error);
                isOk[tablesKey][dataKey] = !error ? 1 : -1;

                let isEnd = true;
                for (let tKey in isOk) {
                    for (let dKey in isOk[tKey]) {
                        if (isOk[tKey][dKey] === 0) isEnd = false;
                    }
                }

                if (isEnd) {
                    callback(calcStatus(isOk, true));
                }
            });
        }
    }
};