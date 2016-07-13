var HundredData = require('HundredData');
var Util = require('Util');
var Game = require('Game');

cc.Class({
    extends: cc.Component,
    properties: {
        id:-1, //区域ID
        maxGold:100, //最大金币数
        _golds:[cc.Node], //筹码对象容器
        betPanel:{ //下注区域节点
        	default:null,
        	type:cc.Node
        },
    },
    onLoad: function () {
        this._betRequests = []; //下注请求
        console.log('百人场-初始化下注区:' + this.id);
        if(!this.betPanel)return;
    	this._resultLabel = this.node.getChildByName('ResultLabel');
        this._resultType = this.node.getChildByName('ResultType');
        this._selfPoint = this.node.getChildByName('SelfPoint');
		this._iconWin = this.betPanel.getChildByName('IconWin');
		this._iconOpen = this.betPanel.getChildByName('IconOpen');
        this._iconClose = this.betPanel.getChildByName('IconClose');
		this._chipArea = this.node.getChildByName('ChipArea'); //筹码区域
        this.betPanel.on(cc.Node.EventType.TOUCH_END, this._handleClick.bind(this), this);
        //数据监听
        HundredData.bindCallF('betAreas:'+ this.id + ':isActive', this._updateIsActive.bind(this));
        HundredData.bindCallF('betAreas:'+ this.id + ':isWin', this._updateIsWin.bind(this));
        HundredData.bindCallF('betAreas:'+ this.id + ':point', this._updatePoint.bind(this));
        HundredData.bindCallF('betAreas:'+ this.id + ':resultText', this._updateResultText.bind(this));
        HundredData.bindCallF('betAreas:'+ this.id + ':pokerType', this._updatePokerType.bind(this));
        HundredData.bindCallF('betAreas:'+ this.id + ':isShowPokerType', this._updateIsShowPokerType.bind(this));
        HundredData.bindCallF('betAreas:'+ this.id + ':selfPoint', this._updateSelfPoint.bind(this));
    },

    _updateIsActive:function(isActive){ 
        if(isActive){
            this._iconOpen.active = true;
            this._iconClose.active = false;
        }else {
            this._iconOpen.active = false;
            this._iconClose.active = true;
        }
        return isActive;
    },

    _updateIsWin:function(isWin){
        this._iconWin.active = isWin;
        return isWin;
    },

    _updatePoint:function(point){
        //更新金币显示
        this.betPanel.getChildByName('Bet').getComponent(cc.Label).string = Util.bigNumToStr(point);
        // var event =  new cc.Event.EventCustom('SEND_POINT', true);
        // event.setUserData({id:this.id-1, point});
        // this.node.dispatchEvent(event);
        return point;
    },

    _updateResultText:function(resultText){
        this._resultLabel.getComponent(cc.Label).string = resultText;
        return resultText;
    },

    _updatePokerType:function(pokerType){
        //设置牌型
        return pokerType;
    },
    //是否显示牌型label
    _updateIsShowPokerType:function(isShow){
        this._resultType.active = isShow;
        if(isShow) {
            this._resultType.getComponent('CardTypeParse').setData(HundredData['betAreas'][this.id].cardType);
        }
        return isShow;
    },
    _updateSelfPoint:function(selfPoint){
        this._selfPoint.getChildByName('point').getComponent(cc.Label).string = Util.bigNumToStr(selfPoint);
        if(selfPoint == 0){
            this._selfPoint.active = false;
        }else if(selfPoint > 0){
            this._selfPoint.active = true;
        }
        return selfPoint;
    },
    //下注动作
    _handleClick:function(event){
        if(!HundredData['betAreas'][this.id].isActive)return;
        this._betRequests.push({potId:this.id, betChips:HundredData['handlePanel'].selectValue});
        //金币效果
        var event =  new cc.Event.EventCustom('SEND_POINT', true);
        event.setUserData({id:this.id-1, selectValue:HundredData['handlePanel'].selectValue});
        this.node.dispatchEvent(event);
    },
    //添加筹码
    addGold:function(node){
        this._chipArea.addChild(node);
        this._golds.push(node);
    },
    //移除桌面筹码
    removeGold:function(cb){
        cb(this._golds);
        this._golds = [];
    },
    //处理下注请求
    handleBetRequest:function(){
        if(this._betRequests.length == 0)return;
        if(HundredData['currentSeatId'] == 0)return; //自己是庄家
        Game.socket.sendBetChips_Hundred(this._betRequests);
        this._betRequests = []; //请求已经处理的
    },
    getChumaNum:function(){
        return this._golds.length;
    }
});
