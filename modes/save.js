const pg = require('pg'),
    getStructure = require('../modules/getStructure'),
    getData = require('../modules/getData'),
    delData = require('../modules/delData'),
    delStructure = require('../modules/delStructure'),
    saveData = require('../modules/saveData'),
    needStop = require('../scripts/needStop'),
    note = require('../scripts/note'),

    {DATA_TYPE, CLEAN} = require('../scripts/constants'),


    end = (poolSrc) => {
        poolSrc.end();

        note("Завершено!");
    },

    cleanSrc = (database, settings, poolSrc) => {
        if (settings.srcClean !== CLEAN.NONE) {
            note("Удаление данных из исходной БД...");

            delData(database.structure, poolSrc, (status) => {
                if (needStop(status, settings, poolSrc)) return;

                if (settings.srcClean === CLEAN.ALL) {
                    note("Удаление структуры исходной БД...");

                    delStructure(database.structure, poolSrc, (status) => {
                        if (needStop(status, settings, poolSrc)) return;

                        end(poolSrc);
                    });
                }
                else {
                    end(poolSrc);
                }
            });
        }
        else {
            end(poolSrc);
        }
    },

    writeData = (database, settings, poolSrc) => {
        note("Запись данных в файл...");

        saveData(database, settings, () => {
            note("Успешно");

            cleanSrc(poolSrc, settings, poolSrc);
        });
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

                writeData({structure, data}, settings, poolSrc);
            });
        }
        else {
            writeData({structure}, settings, poolSrc);
        }
    });
};