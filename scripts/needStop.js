module.exports = (status, settings, pool1, pool2) => {
    console.log('Обработано успешно: ' + status.ok);
    console.log('Ошибок: ' + status.errors);

    if (!settings.ignoreErrors && status.errors > 0) {
        if (pool1) pool1.end();
        if (pool2) pool2.end();
        return true;
    }
    else {
        return false;
    }
};