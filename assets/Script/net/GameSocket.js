var SocketService = require('SocketService');
var P = require('GAME_SOCKET_PROTOCOL');
var Http = require('Http');
var SchedulerPool = require('SchedulerPool');
var GameData = require('GameData');
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
			[P.GET_ROOM_RET] : this.GET_ROOM_RET
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
		this.sendData(P.ENTER_ROOM, {uid : Http.userData.uid, tid : tid});
	},
	

	// 离开房间
	sendLeaveRoom: function(){
		this.sendData(P.CLI_LEAVE, {uid : Http.userData.uid});
	},	

	// 坐下
	sendSitDown:function(seatId){
		this.sendData(P.CLI_SIT_DOWN, {uid : Http.userData.uid, seatId: seatId});
	},

	// 站起
	sendStandUp: function(){
		this.sendData(P.CLI_STAND_UP, {uid : Http.userData.uid});
	},

	// 操作  叫庄（betX = 0 不叫   5 .. 倍数 ） ， 叫倍（betX = 倍数） ， 是否有牛（ betX =  0没牛 1有牛）
	sendDo:function(betX){
		this.sendData(P.CLI_DO, {uid : Http.userData.uid, betX : betX});
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
		}
	},

	GET_ROOM_RET: function(pack){
		if(pack.tid > 0){
			this.sendData(P.CLI_JOIN, {uid : Http.userData.uid, tid: pack.tid, userinfo: JSON.stringify(this.getUserInfo())});
		}
	},

	SVR_DOUBLE_LOGIN: function(pack){
		cc.info("重复登录，断开连接");
		this.disconnect(false);
	},

});

module.exports = GameSocket;
