const QUERY_GET_TABLES = 'SELECT table_name FROM information_schema.tables  where table_schema=\'public\'',
    QUERY_GET_COLUMNS = 'SELECT column_name, table_name, column_default, data_type, character_maximum_length, udt_name FROM information_schema.columns  where table_schema=\'public\'',
    QUERY_GET_KEYS = 'SELECT tc.constraint_name, tc.table_name, kcu.column_name FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name WHERE constraint_type = \'PRIMARY KEY\'';

module.exports = (pool, callback) => {
    pool.query(QUERY_GET_TABLES, (errorsTables, dataTables) => {
        if (errorsTables) console.log(errorsTables);
        if (errorsTables) return callback(null, {ok: 0, errors: 1});

        pool.query(QUERY_GET_COLUMNS, (errorsColumns, dataColumns) => {
            if (errorsColumns) console.log(errorsColumns);
            if (errorsTables) return callback(null, {ok: 0, errors: 1});

            pool.query(QUERY_GET_KEYS, (errorsKeys, dataKeys) => {
                if (errorsKeys) console.log(errorsKeys);
                if (errorsTables) return callback(null, {ok: 0, errors: 1});

                const structure = {};

                for (let keyT in dataTables.rows) {
                    structure[dataTables.rows[keyT].table_name] = {};

                    for (let keyC in dataColumns.rows) {
                        if (dataColumns.rows[keyC].table_name === dataTables.rows[keyT].table_name) {
                            const isSerial = !dataColumns.rows[keyC].column_default ? false : dataColumns.rows[keyC].column_default.substring(0, 7) === 'nextval';

                            if (isSerial && dataColumns.rows[keyC].data_type === "bigint") {
                                structure[dataTables.rows[keyT].table_name][dataColumns.rows[keyC].column_name] = {type: 'BIGSERIAL'};
                            }
                            else {
                                if (isSerial && dataColumns.rows[keyC].data_type === "integer") {
                                    structure[dataTables.rows[keyT].table_name][dataColumns.rows[keyC].column_name] = {type: 'SERIAL'};
                                }
                                else {
                                    structure[dataTables.rows[keyT].table_name][dataColumns.rows[keyC].column_name] = {type: dataColumns.rows[keyC].udt_name};
                                }
                            }

                            for (let keyK in dataKeys.rows) {
                                if (dataKeys.rows[keyK].table_name === dataTables.rows[keyT].table_name) {
                                    structure[dataTables.rows[keyT].table_name][dataColumns.rows[keyC].column_name].isKey = dataKeys.rows[keyK].column_name === dataColumns.rows[keyC].column_name;
                                }
                            }
                        }
                    }
                }

                callback(structure, {ok: 1, errors: 0});
            });
        });
    });
};