function readJSON(data, callback, noCallback){
    for (item in data){
        if (typeof data[item] === 'object' && !Array.isArray(data[item])){
            callback(data[item], callback, noCallback);
        } else {
            noCallback(item, data);
        }
    }
}

module.exports = readJSON;