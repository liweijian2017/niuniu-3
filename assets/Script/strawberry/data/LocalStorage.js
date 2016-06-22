/*
本地存储
@example
~~~~
cc.info(LocalStorage.get('name', 'ALeoDef'));
LocalStorage.set('name', 'ALeo');
~~~~
*/
var Util = require("Util");
var LocalStorage = {};

LocalStorage.set = function(key, value){
	cc.sys.localStorage.setItem(key, Util.base64_encode(value));	
};

LocalStorage.get = function(key, defaultValue){
	var data = cc.sys.localStorage.getItem(key);
	return data == null?defaultValue:Util.base64_decode(data);
};

module.exports = LocalStorage;