const delAllSpaces = (data) => {
    for (let key in data) {
        if (typeof data[key] === 'string') {
            data[key] = delSpace(data[key]);
        }
    }
};

const delSpace = (line) => {
    while (line.substring(line.length - 1, line.length) === ' ') {
        line = line.substring(0, line.length - 1);
    }
    return line;
};

module.exports = {delSpace, delAllSpaces};