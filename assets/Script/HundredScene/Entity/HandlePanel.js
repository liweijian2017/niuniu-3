//玩家操控面板
var Util = require('Util');
var HundredData = require('HundredData');
var HundredStates = require('HundredStates');

cc.Class({
    extends: cc.Component,
    properties: {
        _betBtns:[], //5个筹码按钮
        nameLabel:{
            default:null,
            type:cc.Label
        },
        scoreLabel:{
            default:null,
            type:cc.Label
        },
        pointLabel:{
            default:null,
            type:cc.Label
        },
        betBtnPrefab:{
            default:null,
            type:cc.Prefab
        },
        spriteAtlas:{ //图集
            default:null,
            type:cc.SpriteAtlas,
        },
        bankerPanel:{
            default:null,
            type:cc.Node
        },
        gainLabel:{
            default:null,
            type:cc.Label
        },
        loseLabel:{
            default:null,
            type:cc.Label
        },
        totalLabel:{
            default:null,
            type:cc.Label
        },
    },

    onLoad: function () {
        console.log('百人场-启动-操控面板...');
        this._pouringBtns = this.node.getChildByName('PouringBtns'); //下注按钮容器
        // HundredData.bindCallF('handlePanel', this._updateView.bind(this));
        HundredData.bindCallF('handlePanel:point', this._updatePoint.bind(this));
        HundredData.bindCallF('handlePanel:name', this._updateName.bind(this));
        HundredData.bindCallF('handlePanel:score', this._updateScore.bind(this));
        HundredData.bindCallF('handlePanel:type', this._updateType.bind(this));
        //庄家内容
        HundredData.bindCallF('handlePanel:2:gain', this._updateGain.bind(this));
        HundredData.bindCallF('handlePanel:2:lose', this._updateLose.bind(this));
        HundredData.bindCallF('handlePanel:2:total', this._updateTotal.bind(this));
    },

    _updatePoint:function(point){
        this.getComponent('UserComponent').setPoint(point);
        HundredData['userPoint'] = point;
        return point;
    },

    _updateName:function(name){
        this.nameLabel.string = Util.formatName(name, 6);
        return name;
    },

    _updateScore:function(score){
        this.scoreLabel.string = Util.bigNumToStr(score);
        return score;
    },
    //操控面板类型变化
    _updateType:function(type){
        if(type != HundredData['handlePanel'].preType){ //先隐藏
            if(HundredData['handlePanel'].preType == -2) { //第一次加载不做动画
                this.node.setScale(1,0);
                this._updateType2(type);
                return type;
            }
            var scale = cc.scaleTo(0.2, 1, 0);
            this.node.runAction(cc.sequence(scale, cc.callFunc(this._updateType2.bind(this, type), this)));
        }
        return type;
    },
    //显示对应类型的操控面板
    _updateType2:function(type){
        if(type == -1) return; //修改的是隐藏 则不显示
        if(type != 2){
            this._pouringBtns.active = true;
            this.bankerPanel.active = false;
            this.updateBetBtns(HundredData['handlePanel'][type]);
        }else if(type == 2){ //庄家
            this._pouringBtns.active = false;
            this.bankerPanel.active = true;
            this.gainLabel.string = Util.bigNumToStr2(HundredData['handlePanel'][type].gain);
            this.loseLabel.string = Util.bigNumToStr2(HundredData['handlePanel'][type].lose);
            this.totalLabel.string = Util.bigNumToStr2(HundredData['handlePanel'][type].total);
        }
        HundredData['handlePanel'].preType = type;
        var scale = cc.scaleTo(0.2, 1, 1);
        this.node.runAction(scale);
    },

    _updateGain:function(gain){
        this.gainLabel.string = Util.bigNumToStr2(gain);
        return gain;
    },

    _updateLose:function(lose){
        this.loseLabel.string = Util.bigNumToStr2(lose);
        return lose;
    },

    _updateTotal:function(total){
        this.totalLabel.string = Util.bigNumToStr2(total);
        return total;
    },

    updateBetBtns:function(betValues){ //更新筹码按钮
        this._pouringBtns.removeAllChildren();
        this._betBtns = [];
        for(var i=0; i<5; i++){
            var betBtn = cc.instantiate(this.betBtnPrefab);
            betBtn.getComponent('BetBtn').setSpriteAtlas(this.spriteAtlas);
            betBtn.getComponent('BetBtn').setAttr('_type', i);
            betBtn.getComponent('BetBtn').setAttr('_value', betValues[i]);
            betBtn.parent = this._pouringBtns;
            betBtn.on(cc.Node.EventType.TOUCH_END, this._handleClick.bind(this), this);
            this._betBtns.push(betBtn);
        }
        //更换后的默认值
        this._betBtns[0].getComponent('BetBtn').setAttr('_isSelect', true);
        HundredData['handlePanel'].selectValue = this._betBtns[0].getComponent('BetBtn')._value;
        //更换后的默认状态
        if(HundredStates.getFsm().is('WaitingBet')){
            this.open();
        }else {
            this.close();
        }
    },

    _handleClick:function(event){
        if(!event.currentTarget.getComponent('BetBtn')._isActive)return;
        for(var k in this._betBtns){
            if(this._betBtns[k] === event.currentTarget){
                event.currentTarget.getComponent('BetBtn').setAttr('_isSelect', true);
                HundredData['handlePanel'].selectValue = event.currentTarget.getComponent('BetBtn')._value;
            }else {
                this._betBtns[k].getComponent('BetBtn').setAttr('_isSelect', false);
            }
        }
    },
    //激活按钮
    open:function(){
        for(var k in this._betBtns){
            this._betBtns[k].getComponent('BetBtn').setAttr('_isActive', true);
        }
    },
    //停止所有按钮的点击事件
    close:function(){
        for(var k in this._betBtns){
            this._betBtns[k].getComponent('BetBtn').setAttr('_isActive', false);
        }
    },
});
