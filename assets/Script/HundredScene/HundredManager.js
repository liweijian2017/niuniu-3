var BetLayer = require('BetLayer');
var PopLayer = require('PopLayer');
var IttLayer = require('IttLayer');
var TableLayer = require('TableLayer');
cc.Class({
    extends: cc.Component,

    properties: {
        betAreas:[cc.Node],
        tableLayer:{ //下注层
            default:null,
            type:TableLayer
        },
        betLayer:{ //下注层
            default:null,
            type:BetLayer
        },
        popLayer:{ //弹框层
            default:null,
            type:PopLayer
        },
        ittLayer:{
            default:null,
            type:IttLayer
        }
    },

    onLoad: function () {
        console.log('百人场-启动-游戏管理');
        this.fsm = this.getComponent('HundredStates').getFsm({
            onopenRoom:this._openRoom.bind(this), //加载房间
            onopenBet:this._openBet.bind(this), //打开下注区
            oncloseBet:this._closeBet.bind(this), //关闭下注区
            onsendCards:this._sendCards.bind(this), //发牌
            onopenCards:this._openCards.bind(this), //开牌
            ondividePoint:this._dividePoint.bind(this), //结算
            onenterWaitingBet:this._onbeforeWaitingBet.bind(this), //打开下注区前
        });
    },

    start:function(){
        this.parseRoomPack(); //模拟游戏开始
    },

    //解析房间
    parseRoomPack:function(pack){
        console.log('解析房间包...');
        this.fsm.openRoom(); //打开房间
    },
    //房间加载
    _openRoom:function(){
        console.log('房间初始化');
        this.ittLayer.closeHandlePanel();
        this.scheduleOnce(this.fsm.openBet.bind(this.fsm), 1); //开始下注
    },
    //打开下注区
    _openBet:function(){
        console.log('打开下注区');
        this.popLayer.showToast('开始下注');
        this.ittLayer.openHandlePanel();
        this.scheduleOnce(this.fsm.closeBet.bind(this.fsm), 5); //开始下注
    },
    //关闭下注区
    _closeBet:function(){
        console.log('关闭下注区');
        this.popLayer.closeToast();
        this.ittLayer.closeHandlePanel();
        this.betLayer.closeBetAreas();
        this.fsm.sendCards();//开始发牌
    },
    //开始游戏 进入发牌阶段
    _sendCards:function(){
        console.log('开始发牌');
        this.betLayer.sendPokers(function(){
            console.log('发牌结束');
            console.log('等待玩家下注');
            this.scheduleOnce(this.fsm.openCards.bind(this.fsm), 1); 
        }.bind(this));
    },
    //开牌
    _openCards:function(){
        console.log('开牌');
        this.betLayer.openPokers();
        this.scheduleOnce(this.fsm.dividePoint.bind(this.fsm), 1); //结算
    },
    //结算
    _dividePoint:function(){
        console.log('结算结果,收金币动画');
        this.popLayer.showToast('等待游戏开始');
        console.log('等待游戏开始');
        this.scheduleOnce(this.fsm.openBet.bind(this.fsm), 3);
    },
    //打开下注区之后
    _onbeforeWaitingBet:function(){
        this.popLayer.showStartHint(); //提示
        this.betLayer.removePokers(); //清牌
        this.betLayer.openBetAreas();
    },
});
