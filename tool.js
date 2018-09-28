const pg = require('pg'),
    copy = require('./modes/copy'),
    del = require('./modes/del'),
    load = require('./modes/load'),
    save = require('./modes/save'),
    {MODE, CLEAN, DATA_TYPE} = require('./scripts/constants'),

    settings = {
        mode: MODE.SAVE,
        dataType: DATA_TYPE.ALL,
        srcDatabase: 'postgres://postgres:0000@localhost:5432/full-uptime',
        distDatabase: 'postgres://root:2556525565@185.62.190.171:5432/esay',
        filename: 'backup.txt',
        needCompress: true,
        key: null,
        needCrypto: false,
        srcClean: CLEAN.NONE,
        distClean: CLEAN.NONE,
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