//牌桌管理
var Game = require('Game');
var GameData = require('GameData');
var Http = require('Http');
var GameSocket = require('GameSocket');
var P = require('GAME_SOCKET_PROTOCOL');
var SchedulerPool = require('SchedulerPool');
var sp = new SchedulerPool();
var Router = require('Router');

cc.Class({
    extends: cc.Component,
    properties: {
        tableNode:{
            default:null,
            type:cc.Node
        }
    },
    onLoad: function () {
        Router.tableManager = this;
    	this.table = this.tableNode.getComponent('Table');
        this.mapFun = {  //函数地图
            [P.SVR_JOIN_SUCCESS] : this.SVR_JOIN_SUCCESS, //加入房间
            [P.SVR_TURN_TO] : this.SVR_TURN_TO,
            [P.SVR_GAME_START] : this.SVR_GAME_START,
            [P.SVR_DO_SUCCESS] : this.SVR_DO_SUCCESS,
            [P.SVR_DEAL_ONE_CARD] : this.SVR_DEAL_ONE_CARD,
            [P.SVR_GAME_OVER] :this.SVR_GAME_OVER,
            [P.SVR_SIT_DOWN] : this.SVR_SIT_DOWN,
            [P.SVR_STAND_UP] : this.SVR_STAND_UP,
            [P.SVR_SIT_DOWN_FAIL] : this.SVR_SIT_DOWN_FAIL,
            [P.SVR_LEAVE_SUCCESS] : this.SVR_LEAVE_SUCCESS,
            [P.SVR_JOIN_FAIL] : this.SVR_JOIN_FAIL,
            [P.SVR_SEND_ROOM_BROADCAST] : this.SVR_SEND_ROOM_BROADCAST, //聊天广播
		};
    },
    //游戏开始入口
    start:function () {
        // if(!Game.socket){//模拟登录快速开始过程
        //     GameData.IN_GAME = 0;
        //     var list = Http.getConfigData().serverList[0];
        //     Game.socket = new GameSocket();
        //     Game.socket.connect(list[0], list[1]);
        //     this.scheduleOnce(function(){
        //         Game.socket.sendQuickStart(); //快速开始
        //     }, 1);
        // }
        if(!Game.socket)return;
        Game.socket.addEventListener(GameSocket.EVT_PACKET_RECEIVED, this._onProcessPacket, this);//接受服务器包
        Game.socket.resume();//加入房间
    },
    //离开桌面,移除监听
    onDestroy:function () {
        if(!Game.socket)return;
        Game.socket.removeEventListener(GameSocket.EVT_PACKET_RECEIVED, this._onProcessPacket, this);
        sp.clearAll();
    },
    //处理服务器包
    _onProcessPacket: function(event){
        var pack = event.data;
		if(typeof(this.mapFun[pack.cmd]) == 'function')
			this.mapFun[pack.cmd].call(this, pack);
	},
    //处理本地包
    handleLocalPacket: function(pack){
        if(typeof(this.mapFun[pack.cmd]) == 'function')
            this.mapFun[pack.cmd].call(this, pack);
    },

    //成功加入房间
    SVR_JOIN_SUCCESS:function (pack) {
        this.table.init(pack); //初始化桌子
        this.table.showTabelInfo(pack.venue, pack.blind, pack.score); //台费提示
        this.table.seatImportData(pack.playerList); //设置所有座位数据
        this.table.parseJoinPack(pack);//解析房间包内容
        this.table.autoSitDown();
    },
    //游戏状态切换时
    SVR_TURN_TO:function (pack) {
        this.table.gameStatus = pack.gameStatus;
        switch(this.table.gameStatus){
            case 2: //叫庄结束了
                this.table.makeBanker(pack.bankerSeatId); //确定庄家是谁
                this.table.stateToNext(); // 2
                this.table.showPalyerMultipleWin(pack.timeout);//闲家提供选择倍数
                break;
            case 3: //叫倍结束, 发下第5张牌
                if(this.table.isSit)
                    this.table.popupToast(null, pack.timeout, '等待开牌:');
                this.table.stateToNext(); //3
                break;
            default:
                break;
        }
    },
    //游戏开始
    SVR_GAME_START:function (pack) {
        var self = this;
        this.table.resetGame(); //重新设置状态
        //更新金币
        var startPlayer = this.table.updateSeatGold(pack.playerList);
        this.table.setStateForSeats(1); //游戏开始把所有座位状态改变为1(已经坐下的用户)
        this.table.startHint.getComponent("Toast").show(this.table.startGame.bind(this.table, pack, startPlayer));
    },
    //其他玩家,更新当前状态,判断出当前动作,做出对应的动作显示
    SVR_DO_SUCCESS:function (pack) {
        switch(pack.state) {
            case 1 : //
                break;
            case 2 : //某个玩家,抢庄结束
                this.table.handleOtherSeat(function (seat) {
                    if(seat.id == pack.seatId) {
                        seat.setMultiple(pack.betX);
                    }
                });
                break;
            case 3 ://某个玩家,叫倍结束
                this.table.handleOtherSeat(function (seat) {
                    if(seat.id == pack.seatId) {
                        seat.setMultiple(-1);
                        seat.setPlayerMultiple(pack.betX);
                    }
                });
                break;
            case 4 : //看牛结束
                this.table.handleOtherSeat(function (seat) {
                    if(seat.id == pack.seatId) {
                        seat.doFinish();
                    }
                });
                break;
        }
    },
    //下发第五张牌
    SVR_DEAL_ONE_CARD:function (pack) {
        this.table.finalPokerType = pack.cardType; //记录最终牌形
        this.table.dealFivePoker(pack.handCard5); //下发第五张牌
        this.table.stateToNext(); //4
        this.table.showResultPanel();
    },
    //游戏结束,清空所有人的手牌,计算积分
    SVR_GAME_OVER:function (pack) {
        this.table.gameStatus = 100;
        var self = this;
        this.table.selfSeat.closeResultPanel();
        var overPlayers = this.table.getPlayers(pack); //获取开牌玩家
        this.table.showAllPokers(overPlayers, pack); //开牌
    },
    //某玩家坐下
    SVR_SIT_DOWN:function (pack) {
        this.table.parseSitPack(pack);
    },
    //某玩家站起
    SVR_STAND_UP:function (pack) {
        this.table.parseStandUpPack(pack);
    },
    //坐下失败
    SVR_SIT_DOWN_FAIL:function (pack) {
        this.table.showSitFailWin();
    },
    //登出成功
    SVR_LEAVE_SUCCESS:function (pack) {
        console.log('退出房间成功!');
    },
    //接受到后台发来的聊天广播
    SVR_SEND_ROOM_BROADCAST:function(pack){
        this.table.handleAllSeats(function(seat){
            seat.parseChatPack(pack); //把聊天包交给座位对象处理
        });
    },

});
