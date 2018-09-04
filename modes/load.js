const pg = require('pg'),
    getStructure = require('../modules/getStructure'),
    loadData = require('../modules/loadData'),
    delData = require('../modules/delData'),
    delStructure = require('../modules/delStructure'),
    setStructure = require('../modules/setStructure'),
    setData = require('../modules/setData'),
    needStop = require('../scripts/needStop'),
    note = require('../scripts/note'),

    {DATA_TYPE, CLEAN} = require('../scripts/constants'),


    end = (poolDist) => {
        poolDist.end();

        note("Завершено!");
    },

    writeData = (database, settings, poolDist) => {
        if (settings.dataType !== DATA_TYPE.ONLY_DATA) {
            note("Загрузка структуры в целевую БД...");

            setStructure(database.structure, poolDist, (status) => {
                if (needStop(status, settings, poolDist)) return;

                if (settings.dataType !== DATA_TYPE.ONLY_STRUCTURE) {
                    note("Загрузка данных в целевую БД...");

                    setData(database.data, poolDist, (status) => {
                        if (needStop(status, settings, poolDist)) return;

                        end(poolDist);
                    });
                }
                else {
                    end(poolDist);
                }
            });
        }
        else {
            note("Загрузка данных в целевую БД...");

            setData(database.data, poolDist, (status) => {
                if (needStop(status, settings, poolDist)) return;

                end(poolDist);
            });
        }
    },

    cleanDist = (database, settings) => {
        const poolDist = pg.Pool({
            connectionString: settings.distDatabase
        });

        if (settings.distClean !== CLEAN.NONE) {
            note("Получение структуры целевой БД...");

            getStructure(poolDist, (distStructure, status) => {
                if (needStop(status, settings, poolDist)) return;
                note("Удаление данных из целевой БД...");

                delData(distStructure, poolDist, (status) => {
                    if (needStop(status, settings, poolDist)) return;

                    if (settings.distClean === CLEAN.ALL) {
                        note("Удаление структуры целевой БД...");

                        delStructure(distStructure, poolDist, (status) => {
                            if (needStop(status, settings, poolDist)) return;

                            writeData(database, settings, poolDist);
                        });
                    }
                    else {
                        writeData(database, settings, poolDist);
                    }
                });
            });
        }
        else {
            writeData(database, settings, poolDist);
        }
    };

module.exports = (settings) => {
    note("Загрузка бэкапа из файла...");
    loadData(settings, (data) => {
        note("Успешно");

        cleanDist(data, settings);
    })
};