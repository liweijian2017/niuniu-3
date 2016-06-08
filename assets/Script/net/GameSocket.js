var SocketService = require('SocketService');
var P = require('GAME_SOCKET_PROTOCOL');
var Http = require('Http');
var SchedulerPool = require('SchedulerPool');
var GameData = require('GameData');
var BroadcastReceiver = require('BroadcastReceiver');

var GameSocket = cc.Class({
	extends: SocketService,
	ctor : function(){
		SocketService.prototype.init.call(this, P);
		this.schedulerPool = new SchedulerPool();
		this.loginTimeOutCount = 0;
		this.isLogin = false;
		this.sendBuff = [];

		this.mapFun = {
			[P.SVR_LOGIN_RET] : this.SVR_LOGIN_RET,
			[P.SVR_DOUBLE_LOGIN] : this.SVR_DOUBLE_LOGIN,
			[P.GET_ROOM_RET] : this.GET_ROOM_RET,
			[P.SVR_JOIN_SUCCESS] : this.SVR_JOIN_SUCCESS,
			[P.BROADCAST_DIAMOND_CHANGE_RET]: this.BROADCAST_DIAMOND_CHANGE_RET,
			[P.BROADCAST_MONEY_CHANGE_RET]: this.BROADCAST_MONEY_CHANGE_RET,
		 	[P.BROADCAST_ALL_MESSAGE_RET] : this.BROADCAST_ALL_MESSAGE_RET, //喇叭
		 	[P.SVR_JOIN_FAIL]: this.SVR_JOIN_FAIL,
		 	[P.SVR_CMD_USER_CRASH] : this.SVR_CMD_USER_CRASH, //破产消息
		};
	},

	onProcessPacket: function(pack){
		if(typeof(this.mapFun[pack.cmd]) == 'function')
			this.mapFun[pack.cmd].call(this, pack);
	},

	onAfterConnected: function(){
		this.sendLogin();
	},

	onAfterConnectFailure: function(){
		this.isLogin = false;
		//提示网络异常 连接失败 重新连接
		var self = this;
		var canvas = cc.director.getScene().getChildByName('Canvas');
        canvas.getComponent('PopUp').showDlg("网络异常，重新连接服务器！", function(){
        	self.connect(self.ip_, self.port_);
        });
	},

	onClose:function(evt){
		this.isLogin = false;
		SocketService.prototype.onClose.call(this, evt);
	},

	onHeartBeatReceived: function(delaySeconds){
	    var signalStrength;
	    if (delaySeconds < 0.4)
	        signalStrength = 4;
	    else if (delaySeconds < 0.8)
	        signalStrength = 3;
	    else if (delaySeconds < 1.2)
	        signalStrength = 2;
	    else
	        signalStrength = 1;
	    GameData.SIGNAL_STRENGTH = signalStrength;
	},

 	buildHeartBeatPack: function(){
    	return this.createPacketBuilder(P.KEEP_ALIVE).build();
	},

	sendLogin: function(){
		this.loginTimeoutHandle_ = this.schedulerPool.delayCall(function(){
			cc.warn("login room timeout..");
	        this.loginTimeoutHandle_ = null;
	        this.loginTimeOutCount = this.loginTimeOutCount + 1;
	        if (this.loginTimeOutCount > 5)
	            this.reconnect_();
	        else
	            this.schedulerPool.delayCall(this.sendLogin, this, 2);
		}, this, 3);
		this.sendCmd(P.CLI_LOGIN, {uid : Http.userData.uid, mtkey : Http.userData.sk});
	},

	sendData: function(cmd, data){
		if(this.isLogin)
			SocketService.prototype.sendCmd.call(this, cmd, data);
		else
			this.sendBuff.push([cmd, data]);
	},

    // 加入房间
	sendJoinRoom:function(tid){
		this.sendData(P.ENTER_ROOM, {uid : Http.userData.uid, tid : parseInt(tid)});
	},

	//快速开始
	sendQuickStart:function(){
		this.sendData(P.QUICK_START, {uid : Http.userData.uid, money : Http.userData.point});
	},

	// 离开房间
	sendLeaveRoom: function(){
		this.sendData(P.CLI_LEAVE, {uid : Http.userData.uid});
	},

	// 坐下
	sendSitDown:function(seatId){
		this.sendData(P.CLI_SIT_DOWN, {uid : Http.userData.uid, seatId: parseInt(seatId)});
	},

	// 站起
	sendStandUp: function(){
		this.sendData(P.CLI_STAND_UP, {uid : Http.userData.uid});
	},

	// 操作  叫庄（betX = 0 不叫   5 .. 倍数 ） ， 叫倍（betX = 倍数） ， 是否有牛（ betX =  0没牛 1有牛）
	sendDo:function(betX){
		this.sendData(P.CLI_DO, {uid : Http.userData.uid, betX : parseInt(betX)});
	},

	// 发表情
	sendExpression:function(expressionId){
		this.sendMsg_(0, parseInt(expressionId), "");
	},

	// 发文字聊天
	sendMessage: function(content){
		this.sendMsg_(1, 0, content);
	},

	// 聊天 typeId 0 发表情 1 发文字, expressionId 表情id, content: 聊天文字内容  
	sendMsg_:function(typeId, expressionId, content){
		this.sendData(P.CLI_SEND_ROOM_BROADCAST, {uid: Http.userData.uid, tid: typeId, param: expressionId, content: content});
	},
	
	getUserInfo: function(){
		var u = Http.userData;
		return {
			uid: u.uid,
			seatChips: u.point,
			point: u.score,
			vip: 0,
			nick: u.name,
			img: u.image,
			gender: 'f',
			win: 0,
			lose: 0,
			extInfo: ""
		}
	},

	//登录结果
	SVR_LOGIN_RET: function(pack){
		if(pack.ret == 0){
			this.isLogin = true;
			this.scheduleHeartBeat(P.KEEP_ALIVE, 5, 3);
			this.schedulerPool.clear(this.loginTimeoutHandle_);

			for (var i = 0; i < this.sendBuff.length; i++) {
				var cmdData = this.sendBuff.shift();
				cc.info(cmdData);
				this.sendData(cmdData[0], cmdData[1]);
			};

			if(pack.tid > 0)
			{
			 	this.pause();

          		var canvas = cc.director.getScene().getChildByName('Canvas');
            	canvas.getComponent('PopUp').showLoadding();
			 	this.sendJoinRoom(pack.tid);
			}
			else
			{				
				if( GameData.IN_GAME == 1 )
				{
					var canvas = cc.director.getScene().getChildByName('Canvas');
	            	canvas.getComponent('PopUp').showLoadding("网络异常，正在离开房间");
					cc.director.loadScene('MainScene');
				}
			}
		}
	},

	GET_ROOM_RET: function(pack){
		if(pack.tid > 0){
			this.sendData(P.CLI_JOIN, {uid : Http.userData.uid, tid: pack.tid, userinfo: JSON.stringify(this.getUserInfo())});
		}
	},

	SVR_DOUBLE_LOGIN: function(pack){
		this.disconnect(false);
		var canvas = cc.director.getScene().getChildByName('Canvas');
        canvas.getComponent('PopUp').showDlg("重复登录，断开连接！", function(){
        	if(window.gotoHome)
        	{
        		window.gotoHome();
        	}
        });
	},

	SVR_JOIN_SUCCESS: function(pack){
		cc.director.loadScene('TableScene');
	},

	SVR_JOIN_FAIL: function(pack){
		this.resume();
		var canvas = cc.director.getScene().getChildByName('Canvas');
		canvas.getComponent('PopUp').removeLoadding();
		var msg = "服务器繁忙，请稍后再试！";
		if(pack.errorCode == 2)
			msg = "服务器正在升级，请稍后再试！";
		canvas.getComponent('PopUp').showDlg(msg);
	},

	BROADCAST_DIAMOND_CHANGE_RET: function(pack){
		Http.userData.score = pack.diamond;
	},

	BROADCAST_MONEY_CHANGE_RET: function(pack){
		Http.userData.point = pack.money;
	},

	//接受到喇叭消息
    BROADCAST_ALL_MESSAGE_RET:function(pack){
        BroadcastReceiver.addMessageToList(pack);
    },

    //破产处理
    SVR_CMD_USER_CRASH:function(pack){
        var canvas = cc.director.getScene().getChildByName('Canvas');
        //1.确认用户破产补助次数
        Http.getBankruptInfo(function(data){ //data = {bankruptCount: 2,  reward: {chips: 2000}}
            canvas.getComponent('PopUp').showBankruptWin(data.reward.chips , data.bankruptCount+1, function(){
                Http.getBankruptReward(function(data){
                    canvas.getComponent('PopUp').closeBankruptWin();
                    canvas.getComponent('PopUp').playMoneyPar();
                }, function(err){
                	canvas.getComponent('PopUp').showDlg("领取破产补助失败,请重试", null,null);
                });
            });
        }, function(err){
            console.log(err);
            canvas.getComponent('PopUp').showDlg("已经没有破产补助了,请充值~", function(){
                if(window.gotoPay)
                    window.gotoPay();
            },null);
        });
    },
});

module.exports = GameSocket;
