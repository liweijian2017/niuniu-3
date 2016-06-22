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
cc.Class({
    extends: cc.Component,
    properties: {
        _fsm:null,
    },
    onLoad: function () {
    },
    getFsm:function(callbacks){
        console.log('百人场-开启-状态管理器');
        this._fsm = FSM.create({//创建状态机
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
        return this._fsm;
    },
});
