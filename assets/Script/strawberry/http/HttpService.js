var $ = require("Zepto");
var md5 = require("md5");
var Util = require("Util");
var LocalStorage = require("LocalStorage");
var requireId = 0;
var HttpService = {
    apiUrl: "http://game.manyouwei.cn/dice/api.php",
    uid: 0,
    sk: '',
    requests : {},

    init: function(appId, apiUrl){
    	this.apiUrl = apiUrl;
      this.appId = appId;
    },
	
	//设置登录key
    setSessionKey:function(uid, sk){
        this.uid = uid;
        this.sk = sk;
    },
    
	//私有函数 签名
    _makeSign: function(param){
        var keys = [];
        for (var key in param) {
            keys.push(key);
        }
        keys.sort();
        
        var str = "";
        for (var i = 0; i < keys.length; i++) {
            str = str + keys[i] + "=" + param[keys[i]] + "&";
        }
        str = str.substr(0, str.length - 1) + "NPFCVTEIynqKyjUnDUPMQRMkjoLEkRZ3";
        var md5str = md5(this._base64_encode(str));
        return md5str;
    },
    
	//私有函数 base64编码
    _base64_encode: function (data) {
       return Util.base64_encode(data);
    },
    
	//请求
    request:function(method, param, resultCallback, errorCallback){
          param = param || {};
          var postParam = {
              appId: this.appId,
              uid: this.uid,
              sk: this.sk,
              action: method,
              param: JSON.stringify(param),
              t: (new Date()).getTime()
          };
          postParam.encrptKey = this._makeSign(postParam);
          requireId++;
          var self = this;
          var xhr = $.ajax({
              type: 'POST',
              url: this.apiUrl,
              data: postParam,
              dataType: 'json',
              timeout: 2000,
              success: function(data){
                if(data && data.ret === 0){
                  if(typeof resultCallback == 'function')
                    resultCallback(data);
                }else{
                    if(data)
                    {
                        if(data.ret === 1007)
                        {
                            //var Game = require("Game");
                            //Game.instance.setTips("你的账户在别处登录， 请重新进入游戏", 0);
                            cc.warn("你的账户在别处登录， 请重新进入游戏");
                        }
                        else
                        {
                           if(typeof errorCallback == 'function') 
                                errorCallback(data); 
                        }
                        return;
                    }
                    if(typeof errorCallback == 'function') 
                        errorCallback({ret: -1});
                }
              },
              error: (function(requireId){
                var id = requireId;
                return function(xhr, type){
                  if(self.requests[id].status == 0) //主动取消请求
                      return;
                  if(typeof errorCallback == 'function')                
                      errorCallback({ret: -2, type: type});                
              }})(requireId),
              complete: (function(requireId){
                var id = requireId;
                return function(){
                  self.requests[id] = null;
                }})(requireId),
          });

        this.requests[requireId] = {xhr: xhr, status:1};
        return requireId;
    },

    //获取json文件
    cacheFile: function(url, resultCallback, errorCallback){
      var key = md5(url);
      var data = LocalStorage.get(key, '');
      if(data != '')
      {
        resultCallback( JSON.parse(data) );
        return;
      }
      requireId++;
      var self = this;
      var xhr = $.ajax({
          type: 'GET',
          url: url,            
          dataType: 'json',
          timeout: 2000,
          success: function(data){
            resultCallback(data)
            LocalStorage.set(key, JSON.stringify(data));
          },
          error: (function(requireId){
            var id = requireId;
            return function(xhr, type){
              if(self.requests[id].status == 0) //主动取消请求
                  return;
              if(typeof errorCallback == 'function')                
                  errorCallback({ret: -2, type: type});                
          }})(requireId),
          complete: (function(requireId){
            var id = requireId;
            return function(){
              self.requests[id] = null;
            }})(requireId),
      });
      this.requests[requireId] = {xhr: xhr, status:1};
      return requireId; 
    },

    //取消请求
    cancelRequest:function(id){  
      if(id && this.requests[id]){ 
        this.requests[id].status = 0;
        this.requests[id].xhr.abort();
      }
    }
}

module.exports = HttpService;