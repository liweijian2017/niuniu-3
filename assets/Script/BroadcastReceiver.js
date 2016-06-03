//广播接收器
var GameData = require('GameData'); //游戏数据
var Router = require('Router');
var BroadcastReceiver = {
    //添加一个广播消息
    //{"message":"{\"username\":\"Tester\",\"content\":\"test info.\",\"type\":\"broadcast\",\"senderUid\":0,\"delay\":1}","cmd":28695}
    isRun:false,
    isInit:false,
    init:function(){
        if(BroadcastReceiver.isInit)return;
        //场景切换成功后
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function(event) {
            if(!BroadcastReceiver.isRun){
                BroadcastReceiver.runBroadcast();
            }
            if(cc.director.getScene().getChildByName('Game')){
                // console.log('主场景加载完毕');
                cc.director.preloadScene('TableScene', function(err){
                    if(err)console.err(err);
                    // console.log('桌子场景预加载完毕');
                });
            }
        });
        BroadcastReceiver.isInit = true;
    },

    addMessageToList:function(pack){
    	GameData.BROADCAST_NEWS.push(this.parsePack(JSON.parse(pack.message)));
    	if(!BroadcastReceiver.isRun){
            this.runBroadcast();
        }
    },

    //解析数据包
    parsePack:function(message){
        var broadcastItemData = {
        	numberOfTime : 0, //循环次数
    		message : message.username + " : " + message.content, //内容
        };
        return broadcastItemData;
    },

    //运行广播接收器(主动查询是否有消息需要广播)
    runBroadcast:function(){
    	if(GameData.BROADCAST_NEWS.length > 0) {
    		BroadcastReceiver.isRun = true;
    		var data = GameData.BROADCAST_NEWS[0];
    		GameData.BROADCAST_NEWS.shift(); //删除第一个
    		var canvas = cc.director.getScene().getChildByName('Canvas');
	        var item = cc.instantiate(Router.boradcastItemPrefab);
	        item.getComponent('BroadcastItem').init(data.message, this.runBroadcast.bind(this));
	        item.getComponent('BroadcastItem').setNumberOfTime(data.numberOfTime);
	        canvas.addChild(item);  
    	}else {
	    	BroadcastReceiver.isRun = false;
    	}
    }
};
module.exports = BroadcastReceiver;