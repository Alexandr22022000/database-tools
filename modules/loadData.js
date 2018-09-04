const fs = require('fs'),
    CryptoJS = require('crypto-js');

module.exports = (settings, callback) => {
    fs.readFile(settings.filename, "utf8", (error, data) => {
        if (settings.needCrypto) {
            data = CryptoJS.DES.decrypt(data, settings.key).toString(CryptoJS.enc.Utf8);
        }

        callback(JSON.parse(data));
    });
};