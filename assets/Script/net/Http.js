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
		point: 1500,
		score: 125768,
		uid:   27,  //544, 4087, 4203, 7490
		sk:    'abc58ipalmplay85abc',
		name:  '莫莫',
		image:　'http://game.manyouwei.cn/assets/photo/n4203.jpg',
		xmlevel: 1, 
		token: '',
		isNew: 0	};
}

if(!window.CONFIGDATA){
  window.CONFIGDATA = {
    apiUrl: "http://game-dev.manyouwei.cn/dice/api.php",
    roomList: 'http://game.manyouwei.cn/assets/niuniu/roomlist/20160517192004.json',
    serverList: [['192.168.1.100', '9902'], ['192.168.1.100', '9902']]
  };
}
//end debug data
HttpService.init(3, window.CONFIGDATA.apiUrl);
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
      return HttpService.request("niuniu.getOnlineAll", {}, resultCallback, errorCallback);
    },

    /*
      获取房间在线人数
      @param: type 1初级场 2 中级场 3 高级场
      @return 
      resultCallback(data)
      data = {"1": 5, "2": 3} //{房间id： 人数}
    */
    getOnline:function(type, resultCallback, errorCallback){
      return HttpService.request("niuniu.getOnline", {type: type}, resultCallback, errorCallback);
    },
 
    /*
      快速开始游戏
      @return 
      resultCallback(data)
      data = {tid: 1} 房间id
    */
    quickGame:function(resultCallback, errorCallback){
      return HttpService.request("niuniu.quickGame", {}, resultCallback, errorCallback);
    },

    /*
      财富排行榜
      @return 
      resultCallback(data)
      data = {list: [{image: "http://example.com/xx.jpg", name: "Aleo", point: 1200},{image: "http://example.com/xx.jpg", name: "Aleo", point: 1000}, ...]}
    */
    getTop:function(resultCallback, errorCallback){
      return HttpService.request("game.top", {}, resultCallback, errorCallback);
    },

    /*
      积分排行榜
      resultCallback(data)
      data = {list: [{image: "http://example.com/xx.jpg", name: "Aleo", score: 1200},{image: "http://example.com/xx.jpg", name: "Aleo", score: 1000}, ...]}
    */
    getScoreTop:function(resultCallback, errorCallback){
      return HttpService.request("game.scoreTop", {}, resultCallback, errorCallback);
    },

    /*
     获取破产次数
     resultCallback(data)
     data = {bankruptCount: 2,  reward: {chips: 2000}}   bankruptCount:剩余领取次数， chips:可以领取的游戏币数

     errorCallback(error)
     error = {ret: 1203}    1203 破产补助已经用完，去充值
    */
    getBankruptInfo:function(resultCallback, errorCallback){
      return HttpService.request("bankrupt.getInfo", {}, resultCallback, errorCallback);
    },

    /*
       领取
       resultCallback(data)
       data = {chips: 10000}
    */
    getBankruptReward:function(resultCallback, errorCallback){
      return HttpService.request("bankrupt.getReward", {}, resultCallback, errorCallback);
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