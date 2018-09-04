const pg = require('pg'),
    getStructure = require('../modules/getStructure'),
    delData = require('../modules/delData'),
    delStructure = require('../modules/delStructure'),
    needStop = require('../scripts/needStop'),
    note = require('../scripts/note'),

    {CLEAN} = require('../scripts/constants'),


    end = (poolSrc) => {
        poolSrc.end();

        note("Завершено!");
    };

module.exports = (settings) => {
    const poolSrc = pg.Pool({
        connectionString: settings.srcDatabase
    });

    if (settings.srcClean !== CLEAN.NONE) {
        note("Получение структуры БД...");

        getStructure(poolSrc, (distStructure, status) => {
            if (needStop(status, settings, poolSrc)) return;
            note("Удаление данных из БД...");

            delData(distStructure, poolSrc, (status) => {
                if (needStop(status, settings, poolSrc)) return;

                if (settings.srcClean === CLEAN.ALL) {
                    note("Удаление структуры БД...");

                    delStructure(distStructure, poolSrc, (status) => {
                        if (needStop(status, settings, poolSrc)) return;

                        end(poolSrc);
                    });
                }
                else {
                    end(poolSrc);
                }
            });
        });
    }
    else {
        end(poolSrc);
    }
};