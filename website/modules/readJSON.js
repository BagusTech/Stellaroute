function readJSON(data, callback, noCallback){
    for (item in data){
        if (typeof data[item] === 'object' && !Array.isArray(data[item])){
            callback(item, data);
        } else {
            noCallback(item, data);
        }
    }
}

module.exports = readJSON;