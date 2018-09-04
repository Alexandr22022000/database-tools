const fs = require('fs'),
    CryptoJS = require('crypto-js');

module.exports = (data, settings, callback) => {
    let databaseString = JSON.stringify(data);
    if (settings.needCrypto) {
        databaseString = CryptoJS.DES.encrypt(databaseString, settings.key).toString();
    }
    fs.writeFile(settings.filename, databaseString);

    callback();
};