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
        let columns = '';
        for (let columnsKey in structure[tablesKey]) {
            columns += `${columnsKey} ${structure[tablesKey][columnsKey].type}`;

            if (structure[tablesKey][columnsKey].type === 'CHARACTER')
                columns += ` VARYING(${structure[tablesKey][columnsKey].length})`;

            if (structure[tablesKey][columnsKey].isKey)
                columns += ' PRIMARY KEY';

            columns += ', ';
        }
        columns = columns.substring(0, columns.length - 2);

        pool.query(`CREATE TABLE ${tablesKey}(${columns})`, (error) => {
            if (error) console.log(error);
            isOk[tablesKey] = !error ? 1 : -1;

            let isEnd = true;
            for (let key in isOk) {
                if (isOk[key] === 0) isEnd = false;
            }

            if (isEnd) callback(calcStatus(isOk));
        });
    }
};