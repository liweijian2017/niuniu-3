module.exports = function(data, fun){
    var obj = require('DataProxy').extend(data);
    for(var k in data){
        obj.addDataObserver(k, fun); //观察每一个属性
    }
    return obj;
};