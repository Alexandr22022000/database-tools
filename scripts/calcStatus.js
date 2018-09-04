module.exports = (isOk, is2level) => {
    let ok = 0, errors = 0;

    if (!is2level) {
        for (let key in isOk) {
            if (isOk[key] === 1) ok++;
            else errors++;
        }
    }
    else {
        for (let key in isOk) {
            for (let key2 in isOk[key]) {
                if (isOk[key][key2] === 1) ok++;
                else errors++;
            }
        }
    }

    return {ok, errors};
};