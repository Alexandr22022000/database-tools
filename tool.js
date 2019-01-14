//Schema: postgres://user:password@host:port/database?ssl=true
//Example: postgres://postgres:0000@localhost:5432/avatrade_crm

const pg = require('pg'),
    copy = require('./modes/copy'),
    del = require('./modes/del'),
    load = require('./modes/load'),
    save = require('./modes/save'),
    {MODE, CLEAN, DATA_TYPE} = require('./scripts/constants'),

    settings = {
        mode: MODE.SAVE,
        dataType: DATA_TYPE.ALL,
        srcDatabase: 'postgres://postgres:0000@localhost:5432/avatrade_crm',
        distDatabase: 'postgres://postgres:0000@localhost:5432/avatrade_crm',
        filename: 'database.backup',
        needCompress: true,
        key: null,
        needCrypto: false,
        srcClean: CLEAN.NONE,
        distClean: CLEAN.ALL,
        ignoreErrors: false
    };

switch (settings.mode) {
    case MODE.COPY:
        copy(settings);
        break;

    case MODE.DEL:
        del(settings);
        break;

    case MODE.LOAD:
        load(settings);
        break;

    case MODE.SAVE:
        save(settings);
        break;
}