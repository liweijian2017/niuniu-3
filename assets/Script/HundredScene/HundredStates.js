/*
状态:
NullState:没有进入房间,空状态
WaitingStart:等待开始...
WaitingBet:等待下注...
WaitingSendCards:等待发牌...
WaitingOpenCards:等待开牌...
WaitingCount:等待结算...

事件:
openRoom:开房间
openBet:开放下注
closeBet:关闭下注
SendCards:发牌;
OpenCards:开牌;
dividePoint:结算
closeRoom:关闭房间
*/
var FSM = require('FSM'); //有限状态机
var HundredStates = cc.Class({
    properties: {
        isBanker:false,//用户是否是庄家
        isSit:false, //用户是否坐下
        fsm:null, //牌桌状态机
    },
    ctor: function () {
        cc.log("百人场-开启-状态管理器"); //实例化时，父构造函数会自动调用
    },
    instance:function(callbacks){
        this.fsm = FSM.create({//创建状态机
            initial: 'NullState', 
            events: [
                { name: 'openRoom',  from: 'NullState',  to: 'WaitingStart' }, //开房间,等待开始
                { name: 'openBet',  from: 'WaitingStart',  to: 'WaitingBet' }, //开放下注,等待下注
                { name: 'closeBet',  from: 'WaitingBet',  to: 'WaitingSendCards' }, //结束下注,等待开牌
    　　　　　　{ name: 'sendCards',  from: 'WaitingSendCards',  to: 'WaitingOpenCards' }, //发牌,等待开牌
                { name: 'openCards',  from: 'WaitingOpenCards',  to: 'WaitingCount' }, //开牌,等待结算
                { name: 'dividePoint',  from: 'WaitingCount',  to: 'WaitingStart' },//结算,等待开始
                { name: 'closeRoom',  from: 'WaitingStart',  to: 'NullState' },//关闭房间
　　　　　　],
            callbacks: callbacks
        });
        return this.fsm;
    },
});
module.exports = new HundredStates();