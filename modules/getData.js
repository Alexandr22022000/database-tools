const {delAllSpaces} = require('../scripts/delSpace'),
    calcStatus = require('../scripts/calcStatus');

module.exports = (structure, settings, pool, callback) => {
    const databaseJson = {};

    const isOk = {};
    let isClean = true;
    for (let key in structure) {
        isOk[key] = 0;
        isClean = false;
    }

    if (isClean) {
        callback({}, {errors: 0, ok: 0});
    }

    for (let tablesKey in structure) {
        pool.query(`SELECT * FROM ${tablesKey}`, (error, data) => {
            if (error) console.log(error);
            isOk[tablesKey] = !error ? 1: -1;

            if (settings.needCompress) {
                for (let key in data.rows) {
                    delAllSpaces(data.rows[key]);
                }
            }

            databaseJson[tablesKey] = data.rows;

            let isEnd = true;
            for (let key in isOk) {
                if (isOk[key] === 0) isEnd = false;
            }

            if (isEnd) {
                callback(databaseJson, calcStatus(isOk));
            }
        });
    }
};