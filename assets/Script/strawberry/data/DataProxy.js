/**
属性改变后调用指定方法
@example
~~~~
var userData = {
    'name' : 'ALeo', 
    'point': 1000
};
var userData = DataProxy.extend(userData);
userData.addDataObserver('name', function(){
    cc.info(this.name, '1');
});
var handle = userData.addDataObserver('name', function(){
   cc.info(this.name, '2'); 
});
cc.info(userData.name);
userData.name = 'hello';
userData.removeDataObserver('name', handle);
userData.name = 'world';        
userData.point = 200;
~~~~~
*/
var DataProxy = {};
var __define = function (o, p, g, s) { Object.defineProperty(o, p, { configurable: true, enumerable: true, get: g, set: s }); };
DataProxy.extend = function(data){
	if(data.__handlerList)
		return data;	
	var keys = [];
	for(var k in data)
		keys.push(k);
	data.__handlerList = {};

	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		data['$' + key] = data[key];
		delete data[key];
		__define(data, key, 
		function(key){
		return function(){			
			return this['$' + key];
		}}(key),
		function(key){
		return function(value){
			this['$' + key] = value;
			DataProxy.callFunc(this, key);
		}}(key));
	}	
	data.addDataObserver = function(key, handler){
		handler.call(data);
		return DataProxy.addDataObserver(data, key, handler);
	};

	data.removeDataObserver = function(key, handleToRemove){
		return DataProxy.removeDataObserver(data, key, handleToRemove);
	};

	return data;
};

DataProxy.callFunc = function(data, key){
	if(typeof(data.__handlerList[key]) != 'object')
		return;
	for (var i = 0; i < data.__handlerList[key].length; i++) {
		if(typeof(data.__handlerList[key][i]) == 'function'){
			data.__handlerList[key][i].call(data)
		}
	};
};

DataProxy.addDataObserver = function(data, key, handler){
	var handle = 0;
	if(typeof(data.__handlerList[key]) == 'object')
	{
		var list = data.__handlerList[key];
		handle = list.length;
		list[handle] = handler;
	}
	else
	{
		data.__handlerList[key] = [handler];
	}
	return handle;
};

DataProxy.removeDataObserver = function(data, key, handleToRemove){
	data.__handlerList[key][handleToRemove] = null;
	var isEmpty = true;
	for (var i = 0; i < data.__handlerList[key].length; i++) {
		if(data.__handlerList[key][i] != null)
			isEmpty = false;
	}
	if(isEmpty)
	{
		data.__handlerList[key] = [];
	}
};


module.exports = DataProxy;