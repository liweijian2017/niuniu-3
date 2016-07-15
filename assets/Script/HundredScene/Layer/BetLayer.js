//下注层,手牌层
var Util = require('Util');
var Http = require('Http');
var BetArea = require('BetArea');
var HundredStates = require('HundredStates');
var HundredData = require('HundredData');
var PopLayer = require('PopLayer');

cc.Class({
    extends: cc.Component,
    properties: {
        searchTime:0.2,
        betAreas:[BetArea], //下注区对象
        handlePokers:[cc.Node],//所有手牌
        seats:[cc.Node], //座位集合
        chipAreas:[cc.Node],
        popLayer:{ //弹框层
            default:null,
            type:PopLayer
        },
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
        chumaPrefab:{ //筹码模具
            default:null,
            type:cc.Prefab
        },
    },

    onLoad: function () {
        //初始化筹码奖池
        HundredData.bindCallF('betAreas:point', this._updatePond.bind(this));
        this.chumaPool = new cc.NodePool(cc.Node);
        for (let i = 0; i < 200; ++i) {
            var chuma = cc.instantiate(this.chumaPrefab);
            this.chumaPool.put(chuma);
        }
        //定时处理下注请求列表
        this.schedule(this._handleAllBetRequests.bind(this), 0.3);

        //监听自己下注
        this.node.on('SEND_POINT', function(event){
            var msg  = event.getUserData();
            this.sendPoint(5, msg.id, this._chipsToGold(msg.selectValue));
            event.stopPropagation();
        }.bind(this), this); 
    },

    onDestroy:function(){
        //移除所有该节点上面的定时器
        // this.node.unscheduleAllForTarget(this);
    },

    update:function(){
        for(var k in this.chipAreas){
            if(this.chipAreas[k].children.length > 50){
                var gold = this.betAreas[k]._golds.shift();
                this.chumaPool.put(gold);
            }
        }
    },
    //
    createChuma: function () {
        var chuma = null;
        if (this.chumaPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            chuma = this.chumaPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            chuma = cc.instantiate(this.chumaPrefab);
        }
        return chuma;
    },
    //重新整理牌桌
    reSetBet:function(){
        this.clearAllBets();//庄家收取输掉的筹码
        HundredData['banker'].isShowPokerType = false;
        for(var i=1; i<=4; i++){
            HundredData['betAreas'][i].point = 0;
            HundredData['betAreas'][i].isWin = false;
            HundredData['betAreas'][i].selfPoint = 0;
            HundredData['betAreas'][i].resultText = '';
            HundredData['betAreas'][i].isShowPokerType = false;
        }
        this.removePokers();//移除所有手牌
    },
    //更新奖池
    _updatePond:function(point){
        this.poundLabel.string = Util.bigNumToStr(point);
    },
    //执行发牌动画,且发牌
    sendPokers:function(callBack){
        var worldPos =this.sendPokersPosition.convertToWorldSpaceAR(cc.p(0,0));
        for(var k in this.handlePokers){ //5个手牌
            var pokerValues = null;
            if(k == 0){ //庄家
                pokerValues = HundredData['banker'].pokers;
            }else { 
                pokerValues = HundredData['betAreas'][k].pokers;
            }
            for(var i=0; i<5; i++){
                var poker = cc.instantiate(this.pokerPrefab);
                var startPos = this.handlePokers[k].convertToNodeSpaceAR(worldPos);
                poker.parent = this.handlePokers[k];
                poker.setPosition(startPos);
                poker.getComponent('Poker').init(pokerValues[i]);
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
        }
    },
    //开牌
    openPokers:function(){
        for(var k in this.handlePokers){ //k==0是庄家
            var childs = this.handlePokers[k].getChildren();
            this.scheduleOnce(function(childs, k){//按照顺序开牌
                for(var x in childs){ //开牌
                    var action = cc.sequence(cc.scaleTo(0.15, 0, 1), cc.callFunc(function(poker){
                        poker.getComponent('Poker').setAttr('show', true);
                        poker.scale = 1;
                    }.bind(this, childs[x]),this));
                    childs[x].runAction(action);
                }
                if(k != 0){ //下注区域
                    var bet = HundredData['betAreas'][k];
                    bet.isShowPokerType = true;
                    if(bet.multiple > 0){ //胜利
                        bet.isWin = true;
                        if(Util.contains(bet.participators, 5)){ //自己也投了钱
                            bet.resultText = 'x' + bet.multiple + ' +' + Util.bigNumToStr(bet.selfPoint*bet.multiple); //倍数显示, 赢得的金币显示
                        }
                    }else{ //输了
                        bet.isWin = false;
                    }
                }else { //庄家
                    HundredData['banker'].isShowPokerType = true;
                }
            }.bind(this, childs, k),0.3*k);
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
        HundredData['betAreas'][1].isActive = true;
        HundredData['betAreas'][2].isActive = true;
        HundredData['betAreas'][3].isActive = true;
        HundredData['betAreas'][4].isActive = true;
    },
    //关闭下注区
    closeBetAreas:function(){
        HundredData['betAreas'][1].isActive = false;
        HundredData['betAreas'][2].isActive = false;
        HundredData['betAreas'][3].isActive = false;
        HundredData['betAreas'][4].isActive = false;
    },
    //下筹码动作
    sendPoint:function(seatId, betId, num, interval){ //座位id,下注区id 
        for(var i=0; i<num; i++){
            this.scheduleOnce(function(){
                var chuma = this.createChuma();
                var panel = this.betAreas[betId].node.getChildByName('ChipArea');           
                this.betAreas[betId].addGold(chuma);
                var endPos = Util.randomPos(panel.width-chuma.width, panel.height-chuma.height);
                //执行动画
                if(this.seats[seatId].getComponent('UpDownAni'))this.seats[seatId].getComponent('UpDownAni').play();
                var worldPos = this.seats[seatId].convertToWorldSpaceAR(cc.p(0,0));
                var startPos = panel.convertToNodeSpaceAR(worldPos);
                chuma.setPosition(startPos);
                chuma.runAction(cc.spawn(cc.moveTo(0.3, endPos), cc.scaleTo(0.3, 1)).easing(cc.easeOut(3.0)));
            }, (interval||0.15)*i);
        }
    },
    //从下注区拿筹码 arr[0,1,2,3,4,5,6] //对应着所有座位
    removeChuma:function(betId, arr, cb){
        if(arr.length == 0) return;
        var targetPos = [];
        for(var j in arr){ //转换成对象
            targetPos.push(this.seats[arr[j]].convertToWorldSpaceAR(cc.p(0,0)));
        }
        //所有的筹码分成等份
        this.betAreas[betId].removeGold(function(golds){
            for(var k in golds){
                this.scheduleOnce(function(k){
                    var move = cc.moveTo(0.5, golds[k].parent.convertToNodeSpaceAR(targetPos[k%targetPos.length]));
                    golds[k].runAction(cc.sequence(move, cc.callFunc(function(gold){
                        this.chumaPool.put(gold);
                    }.bind(this, golds[k]),this)));
                }.bind(this, k), 0.007*k);
            }
            if(cb)
                this.scheduleOnce(cb, golds.length*0.007+0.5);
        }.bind(this));
    },
    //处理所有的下注区
    clearAllBets:function(){
        // var count = 0;
        for(var i=1; i<=4; i++){ //遍历所有区域
            if(!HundredData['betAreas'][i].isWin){ //输的区域
                    this.removeChuma(i-1, [0]);//收取
            }else { //赢的区域
                if(HundredData['betAreas'][i].point > 0){//bet是否有钱
                    this.scheduleOnce(this.putPoint.bind(this, i-1), 1);
                }
            }
        }
        this.scheduleOnce(this.openResultWin, 1.5);
    },
    //庄家先投入输的筹码
    putPoint:function(betId){
        this.sendPoint(0, betId, this.betAreas[betId].getChumaNum()*HundredData['betAreas'][betId+1].multiple, 0.007);
        //闲家分筹码
        this.scheduleOnce(this.splitPoint.bind(this, betId), 0.8); 
    },
    //庄家把奖池的金币分给下注的座位
    splitPoint:function(betId){
        this.removeChuma(betId, HundredData['betAreas'][betId+1].participators);
    },
    //解析同步下注包
    _parseBetData:function(data){
        // var data = HundredData['syncBetData'];
        if(!data)return;
        var bets = data.bets;
        for(var k in bets){//分4次下发
            if(bets[k].betChips == 0)continue;
            HundredData['betAreas'][bets[k].potId].point = bets[k].betChips;
            if(bets[k].seatId == data.seatId)continue; //自己不用动画
            console.log('金币数：' +　bets[k].betChips);
            console.log('下注区域:' + bets[k].potId);
            this.schedule(function(seatId, posId, point){
                this.sendPoint(seatId, posId-1, this._chipsToGold(point/2));
            }.bind(this, bets[k].seatId > 5 ? 5 : bets[k].seatId, bets[k].potId, bets[k].betChips), 1, 2);
        }
    },
    //下注换算筹码个数
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
        }else {
            return 6;
        }
        return 1;
    },
    //处理所有的下注请求
    _handleAllBetRequests:function(){
        if(HundredStates.getFsm().is('WaitingBet')){
            for(var k in this.betAreas){
                this.betAreas[k].handleBetRequest();
            }
        }
    },
    restoreBetChips:function(){
        for(var k=1; k<5; k++){
            var num = this._chipsToGold(HundredData['betAreas'][k].point);
            num = num>0? num+10 : num;
            for(var i=0; i<num; i++){
                var chuma = this.createChuma();
                var panel = this.betAreas[k-1].node.getChildByName('ChipArea');           
                this.betAreas[k-1].addGold(chuma);
                chuma.setPosition(Util.randomPos(panel.width-chuma.width, panel.height-chuma.height));
            }
        }
    },
    //打开结算弹框
    openResultWin:function(){
        if(!HundredData['isAttend'])return;
        this.popLayer.openResultWin();
        this.scheduleOnce(function(){ 
            this.popLayer.closeResultWin();
            HundredData['isAttend'] = false;//更改状态
        }, 2.5);

        this.scheduleOnce(function(){ //显示弹框
            if(HundredData['luckPound'].luckChips > 0){
                this.popLayer.openWinningWin();
                this.scheduleOnce(function(){ 
                    this.popLayer.closeWinningWin();
                    HundredData['luckPound'].luckChips = 0;
                    this.hintChumaChange(); //金币浮动
                }, 2);
            }else {
                this.hintChumaChange();
            }
        }, 2.5);
    },
    hintChumaChange:function(){
        var changeList = HundredData['seatChangeList'];
        for(var j in changeList){
            if(changeList[j].chips == 0)continue;
            var seatId = changeList[j].seatId;
            if(seatId == 0){ //庄家
                HundredData['banker'].point = changeList[j].buyinChips;
            }else if(seatId >0 && seatId <5){ //0-4 座位
                HundredData['seats'][seatId].point = changeList[j].buyinChips;
            }else if(seatId == 99){ //自己
                if(HundredData['currentSeatId'] != 0)
                    HundredData['handlePanel'].point = changeList[j].buyinChips;
            }
        }
    },
    //清空下注请求列表
    removeAllBetRequest:function(){
        for(var k in this.betAreas){
                this.betAreas[k].removeBetRequest();
        }
    },

});
