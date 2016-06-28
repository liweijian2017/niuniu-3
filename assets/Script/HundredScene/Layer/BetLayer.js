//下注层,手牌层
var Util = require('Util');
var BetArea = require('BetArea');
var BaseComponent = require('BaseComponent');
var HundredStates = require('HundredStates');

cc.Class({
    extends: BaseComponent,

    properties: {
        _poundPoint:0,
        betAreas:[BetArea], //下注区对象
        handlePokers:[cc.Node],//所有手牌
        seats:[cc.Node], //座位集合
        poundLabel:{ //奖池数值
            default:null,
            type:cc.Label
        },
        sendPokersPosition:{ //发牌的起始点
            default:null,
            type:cc.Node
        },
        pokerPrefab:{ //单张牌模具
            default:null,
            type:cc.Prefab
        },
        chumaPrefab:{ //单张牌模具
            default:null,
            type:cc.Prefab
        },
    },

    onLoad: function () {
        this._poundPoint = 110111111;
        this._isChange = true;
        this.node.on('SELECT_BET', function (event) {
            var betId = event.getUserData().msg;
            this.sendPoint(1, betId, 1);
        }.bind(this));

        //TODO 模式接受服务器消息
        this.schedule(function(){
            if(!HundredStates._fsm.is('WaitingBet'))return;
            var length = parseInt(Math.random()*8);
            var bets = [];
            for(var i=0; i<length; i++){
                bets.push({
                    potId:parseInt(Math.random()*4),//0-3
                    seatId:parseInt(Math.random()*99) + 1,//1-99
                    betChips:parseInt(Math.random()*1000000),
                });
            }
            bets.push({
                potId:parseInt(Math.random()*4),//0-3
                seatId:1,//1-4
                betChips:parseInt(Math.random()*100000),
            });
            bets.push({
                potId:parseInt(Math.random()*4),//0-3
                seatId:2,//1-4
                betChips:parseInt(Math.random()*100000),
            });
            bets.push({
                potId:parseInt(Math.random()*4),//0-3
                seatId:3,//1-4
                betChips:parseInt(Math.random()*100000),
            });
            bets.push({
                potId:parseInt(Math.random()*4),//0-3
                seatId:4,//1-4
                betChips:parseInt(Math.random()*100000),
            });
            var data = {
                seatId:1, 
                bets:bets
            }
            this._parseBetData(data);
        }, 2);

        // this.schedule(function(){
        //     // if(!HundredStates._fsm.is('WaitingBet'))return;
        //     var length = parseInt(Math.random()*8);
        //     var bets = [];
        //     for(var i=0; i<length; i++){
        //         bets.push({
        //             potId:1,//0-3
        //             seatId:parseInt(Math.random()*99) + 1,//1-99
        //             betChips:parseInt(Math.random()*1000000),
        //         });
        //     }
        //     var data = {
        //         seatId:1, 
        //         bets:bets
        //     }
        //     this._parseBetData(data);
        // }, 2);
    },

    onDestroy:function(){
        //移除所有该节点上面的定时器
        this.unscheduleAllForTarget(this);
    },

    _updateNode:function(){
        this.poundLabel.string = Util.bigNumToStr(this._poundPoint);
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
                    var ani = cc.spawn(cc.moveTo(0.5, cc.p(15*index-15,0)), cc.scaleTo(0.5, 1)).easing(cc.easeOut(3.0));
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
    //打开下注区
    openBetAreas:function(){
        for(var k in this.betAreas){
            this.betAreas[k].setAttr('_isActive', true);
        }
    },
    //关闭下注区
    closeBetAreas:function(){
        for(var k in this.betAreas){
            this.betAreas[k].setAttr('_isActive', false);
        }
    },
    //执行筹码动画,更新对应下注区, 筹码数
    sendPoint:function(seatId, betId, num){ //座位id,下注区id 
        for(var i=0; i<num; i++){
            this.scheduleOnce(function(){
                var chuma = cc.instantiate(this.chumaPrefab);
                var panel = this.betAreas[betId].node.getChildByName('ChipArea');
                // chuma.parent = panel;              
                this.betAreas[betId].addGold(chuma);
                var endPos = Util.randomPos(panel.width-chuma.width, panel.height-chuma.height);
                //执行动画
                var worldPos = this.seats[seatId].convertToWorldSpaceAR(cc.p(0,0));
                var startPos = panel.convertToNodeSpaceAR(worldPos);
                chuma.setPosition(startPos);
                chuma.runAction(cc.spawn(cc.moveTo(0.3, endPos), cc.scaleTo(0.3, 1)).easing(cc.easeOut(3.0)));
            }, 0.15*i);
        }
    },
    //筹码
    putPoint:function(betId, seatId, num){
    },
    //移除所有筹码
    removeAllBets:function(){
        for(var k in this.betAreas){
            this.betAreas[k].node.getChildByName('ChipArea').removeAllChildren();
        }
    },
    //解析同步下注包
    _parseBetData:function(data){
        //分4次下发
        var bets = data.bets;
        for(var k in bets){
            this.schedule(function(seatId, posId){
                this.sendPoint(seatId, posId, this._chipsToGold(bets[k].betChips/2));
            }.bind(this, bets[k].seatId > 5 ? 5 : bets[k].seatId, bets[k].potId), 1, 2);
        }
    },
    //换算
    _chipsToGold:function(chips){
        if(chips <= 0)
            return 0;
        else if(chips<999){
            return 1;
        }else if(chips<4999){
            return 2;
        }else if(chips<9999){
            return 3;
        }else if(chips<99999){
            return 4;
        }else if(chips<999999){
            return 5;
        }
        return 1;
    }

});
