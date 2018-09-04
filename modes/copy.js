const pg = require('pg'),
    getStructure = require('../modules/getStructure'),
    getData = require('../modules/getData'),
    delData = require('../modules/delData'),
    delStructure = require('../modules/delStructure'),
    setStructure = require('../modules/setStructure'),
    setData = require('../modules/setData'),
    needStop = require('../scripts/needStop'),
    note = require('../scripts/note'),

    {DATA_TYPE, CLEAN} = require('../scripts/constants'),


    end = (poolDist, poolSrc) => {
        poolDist.end();
        poolSrc.end();

        note("Завершено!");
    },

    cleanSrc = (database, settings, poolDist, poolSrc) => {
        if (settings.srcClean !== CLEAN.NONE) {
            note("Удаление данных из исходной БД...");

            delData(database.structure, poolSrc, (status) => {
                if (needStop(status, settings, poolDist, poolSrc)) return;

                if (settings.srcClean === CLEAN.ALL) {
                    note("Удаление структуры исходной БД...");

                    delStructure(database.structure, poolSrc, (status) => {
                        if (needStop(status, settings, poolDist, poolSrc)) return;

                        end(poolDist, poolSrc);
                    });
                }
                else {
                    end(poolDist, poolSrc);
                }
            });
        }
        else {
            end(poolDist, poolSrc);
        }
    },

    writeData = (database, settings, poolDist, poolSrc) => {
        if (settings.dataType !== DATA_TYPE.ONLY_DATA) {
            note("Загрузка структуры в целевую БД...");

            setStructure(database.structure, poolDist, (status) => {
                if (needStop(status, settings, poolDist, poolSrc)) return;

                if (settings.dataType !== DATA_TYPE.ONLY_STRUCTURE) {
                    note("Загрузка данных в целевую БД...");

                    setData(database.data, poolDist, (status) => {
                        if (needStop(status, settings, poolDist, poolSrc)) return;

                        cleanSrc(database, settings, poolDist, poolSrc);
                    });
                }
                else {
                    cleanSrc(database, settings, poolDist, poolSrc);
                }
            });
        }
        else {
            note("Загрузка данных в целевую БД...");

            setData(database.data, poolDist, (status) => {
                if (needStop(status, settings, poolDist, poolSrc)) return;

                cleanSrc(database, settings, poolDist, poolSrc);
            });
        }
    },

    cleanDist = (database, settings, poolSrc) => {
        const poolDist = pg.Pool({
            connectionString: settings.distDatabase
        });

        if (settings.distClean !== CLEAN.NONE) {
            note("Получение структуры целевой БД...");

            getStructure(poolDist, (distStructure, status) => {
                if (needStop(status, settings, poolDist, poolSrc)) return;

                note("Удаление данных из целевой БД...");

                delData(distStructure, poolDist, (status) => {
                    if (needStop(status, settings, poolDist, poolSrc)) return;

                    if (settings.distClean === CLEAN.ALL) {
                        note("Удаление структуры целевой БД...");

                        delStructure(distStructure, poolDist, (status) => {
                            if (needStop(status, settings, poolDist, poolSrc)) return;

                            writeData(database, settings, poolDist, poolSrc);
                        });
                    }
                    else {
                        writeData(database, settings, poolDist, poolSrc);
                    }
                });
            });
        }
        else {
            writeData(database, settings, poolDist, poolSrc);
        }
    };

module.exports = (settings) => {
    const poolSrc = pg.Pool({
        connectionString: settings.srcDatabase
    });

    note("Получение структуры исходной БД...");

    getStructure(poolSrc, (structure, status) => {
        if (needStop(status, settings, poolSrc)) return;

        if (settings.dataType !== DATA_TYPE.ONLY_STRUCTURE) {
            note("Получение данных из исходной БД...");

            getData(structure, settings, poolSrc, (data, status) => {
                if (needStop(status, settings, poolSrc)) return;

                cleanDist({structure, data}, settings, poolSrc);
            });
        }
        else {
            cleanDist({structure}, settings, poolSrc);
        }
    });
};