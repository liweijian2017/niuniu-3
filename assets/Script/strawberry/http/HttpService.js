var $ = require("Zepto");
var md5 = require("md5");
var requireId = 0;
var HttpService = {
    apiUrl: "http://game.manyouwei.cn/dice/api.php",
    uid: 0,
    sk: '',
    requests : {},

    init: function(apiUrl){
    	this.apiUrl = apiUrl;
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
        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = '',
        tmp_arr = []
        
        if (!data) {
            return data
        }
        
        data = unescape(encodeURIComponent(data))
        
        do {
        // pack three octets into four hexets
        o1 = data.charCodeAt(i++)
        o2 = data.charCodeAt(i++)
        o3 = data.charCodeAt(i++)
        
        bits = o1 << 16 | o2 << 8 | o3
        
        h1 = bits >> 18 & 0x3f
        h2 = bits >> 12 & 0x3f
        h3 = bits >> 6 & 0x3f
        h4 = bits & 0x3f
        
        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4)
        } while (i < data.length)
        
        enc = tmp_arr.join('')
        
        var r = data.length % 3
        
        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3)
    },
    
	//请求
    request:function(method, param, resultCallback, errorCallback){
          param = param || {};
          var postParam = {
              appId: 3,
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
      requireId++;
      var self = this;
      var xhr = $.ajax({
          type: 'GET',
          url: url,            
          dataType: 'json',
          timeout: 2000,
          success: resultCallback,
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
      this.requests[id].status = 0;
      this.requests[id].xhr.abort();
    }
}

module.exports = HttpService;