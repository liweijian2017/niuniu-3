//下注层,手牌层
var BetArea = require('BetArea');

cc.Class({
    extends: cc.Component,

    properties: {
        handlePokers:[cc.Node],
        betAreas:[BetArea],
        sendPokersPosition:{ //发牌的起始点
            default:null,
            type:cc.Node
        },
        pokerPrefab:{ //单张牌模具
            default:null,
            type:cc.Prefab
        },
    },

    onLoad: function () {
    },

    onDestroy:function(){
        //移除所有该节点上面的定时器
        this.unscheduleAllForTarget(this);
    },
    //执行发牌动画,且发牌
    sendPokers:function(callBack){
        var worldPos =this.sendPokersPosition.convertToWorldSpaceAR(cc.p(0,0));
        for(var k in this.handlePokers){
            for(var i=0; i<5; i++){
                var poker = cc.instantiate(this.pokerPrefab);
                var startPos = this.handlePokers[k].convertToNodeSpaceAR(worldPos);
                poker.parent = this.handlePokers[k];
                poker.setPosition(startPos);
                poker.setScale(0.3);
                poker.active = false;
            }
        }
        this._aniForPoker(callBack);
    },
    //发牌动画
    _aniForPoker:function(callBack){
        var count = 0;
        for(var k in this.handlePokers){
            var childs = this.handlePokers[k].getChildren();
            for(var x in childs){
                count++;
                this.scheduleOnce(function(poker, count, index){
                    poker.active = true;
                    var sendEnded = function(){
                        if(count == this.handlePokers.length*5)callBack();
                    };
                    var ani = cc.spawn(cc.moveTo(0.5, cc.p(15*index-15,0)), cc.scaleTo(0.5, 1)).easing(cc.easeOut(3.0));;
                    poker.runAction(cc.sequence(ani, cc.callFunc(sendEnded, this)));
                }.bind(this, childs[x], count, x),0.1*count);
            }
            //分开5张牌
        }
    },
    //开牌
    openPokers:function(){
        for(var k in this.handlePokers){
            var childs = this.handlePokers[k].getChildren();
            for(var x in childs){
                var action = cc.sequence(cc.scaleTo(0.15, 0, 1), cc.callFunc(function(poker){
                    poker.getComponent('Poker').setAttr('show', true);
                }.bind(this, childs[x]),this));
                childs[x].runAction(action);
            }
        }
    },
    //移除所有的牌
    removePokers:function(){
        for(var k in this.handlePokers){
            this.handlePokers[k].removeAllChildren();
        }
    },
    //执行筹码动画,更新对应下注区
    sendPoint:function(seatId, betId){ //座位id,下注区id
        
    },
    //打开下注区
    openBetAreas:function(){
        for(var k in this.betAreas){
            this.betAreas[k].setAttr('_isActive', true);
        }
    },
    closeBetAreas:function(){
        for(var k in this.betAreas){
            this.betAreas[k].setAttr('_isActive', false);
        }
    },
});
