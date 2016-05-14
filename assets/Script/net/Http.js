/**
调用Http接口
@example
~~~~
var Http  = require('Http');
 Http.getRoomList(function(data){
      cc.info(data);
 });

  var reqId = Http.getOnline(1, function(data){
      cc.info(data);
  }, function(error){
      cc.info(error);
  });
  Http.cancelRequest(reqId);
~~~
*/
var HttpService = require('HttpService');
var DataProxy = require('DataProxy');
//debug data
if(!window.USERDATA){
	window.USERDATA = {
		point: 40000,
		score: 4000,
		uid:   543,
		sk:    'f8e57ea08b957905dc50c511bf69b888',
		name:  'ALeo',
		image:　'http://game.manyouwei.cn/assets/photo/n544.jpg',
		xmlevel: 1, 
		token: '',
		isNew: 0	};
}

if(!window.CONFIGDATA){
  window.CONFIGDATA = {
    roomList: 'http://game.manyouwei.cn/assets/niuniu/roomlist/201505132006.json',
    serverList: [['121.40.24.158', '9902'], ['121.40.24.158', '9902']]
  };
}
//end debug data
HttpService.init("http://game.manyouwei.cn/dice/api.php");
HttpService.setSessionKey(window.USERDATA.uid, window.USERDATA.sk);

var http = {   
  	/*
  	  获得用户基本信息
  	  @return {
  		point: 40000,  筹码
  		score: 4000,   积分
  		uid:   544,    用户id
  		sk:    'f8e57ea08b957905dc50c511bf69b888',
  		name:  'ALeo', 用户名
  		image: 'http://game.manyouwei.cn/assets/photo/n544.jpg', 头像
  		xmlevel: 1, 糖果消消乐关卡等级
  		token: '',
  		isNew: 0	 是否首次登录
  	  }
  	*/
  	getUserData:function(){
  		return DataProxy.extend(window.USERDATA);
  	},

    /*
      获取配置信息
      @return{
        roomList: 'http://game.manyouwei.cn/assets/niuniu/roomlist/201512211100.json', //房间配置文件
        serverList: [["192.168.1.100","8080"],["192.168.1.100","8080"]]  //服务器ip列表
      }
    */
    getConfigData:function(){
      return window.CONFIGDATA;
    },
  	
    //取消请求
    cancelRequest:function(reqId){
      HttpService.cancelRequest(reqId);
    },

    /*
      获取房间列表
      resultCallback(data)
      data = [[1,1,50, 500],[2,1,50, 500],[3,2,50, 500], ...] //[房间ID, 房间场次(1:初级场, 2:中级场, 3:高级场), 底分, 进房下限]
    */
    getRoomList:function(resultCallback){
      return HttpService.cacheFile(this.getConfigData().roomList, resultCallback);
    },

    /*
      获取在线人数
      resultCallback(data)
      data = {count : 180} //count 在线人数
    */
    getOnlineAll:function(resultCallback, errorCallback){
      return HttpService.request("game.getOnlineAll", {}, resultCallback, errorCallback);
    },

    /*
      获取房间在线人数
      @param: type 1初级场 2 中级场 3 高级场
      @return 
      resultCallback(data)
      data = {"1": 5, "2": 3} //{房间id： 人数}
    */
    getOnline:function(type, resultCallback, errorCallback){
      return HttpService.request("game.getOnline", {type: type}, resultCallback, errorCallback);
    },
 
    /*
      快速开始游戏
      @return 
      resultCallback(data)
      data = {tid: 1} 房间id
    */
    quickGame:function(resultCallback, errorCallback){
      return HttpService.request("game.quickGame", {}, resultCallback, errorCallback);
    }
};

var __define = function (o, p, g, s) { Object.defineProperty(o, p, { configurable: true, enumerable: true, get: g, set: s }); };
__define(http, 'userData', function(){
    if(!this.$userData)
      this.$userData = this.getUserData();
    return this.$userData;
});

window.Http = http;
module.exports = http;