/*
本地存储
@example
~~~~
cc.info(LocalStorage.get('name', 'ALeoDef'));
LocalStorage.set('name', 'ALeo');
~~~~
*/
var LocalStorage = {}
LocalStorage.set = function(key, value){
	cc.sys.localStorage.setItem(key, value);	
};

LocalStorage.get = function(key, defaultValue){
	var data = cc.sys.localStorage.getItem(key);
	return data == null?defaultValue:data;
};

module.exports = LocalStorage;