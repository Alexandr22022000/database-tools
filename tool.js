const pg = require('pg'),
    copy = require('./modes/copy'),
    del = require('./modes/del'),
    load = require('./modes/load'),
    save = require('./modes/save'),
    {MODE, CLEAN, DATA_TYPE} = require('./scripts/constants'),

    settings = {
        mode: MODE.COPY,
        dataType: DATA_TYPE.ALL,
        srcDatabase: 'postgres://tpwfhhhslvhrdn:3aa60ea44a550842ac4c54976221f4995c994858ed1148515bce79c0ff4f21b9@ec2-79-125-110-209.eu-west-1.compute.amazonaws.com:5432/dbeijf1b6e4kkj?ssl=true',
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