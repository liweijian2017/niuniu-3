//玩家操控面板
var Util = require('Util');
// var BaseComponent = require('BaseComponent');
var HundredData = require('HundredData');

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
        this.handle = HundredData.bindCallF('handlePanel', this._updateView.bind(this));
    },

    _updateView:function(data){ //数据发生变动
        if(data.type !== data.preType){ //先隐藏
            if(data.preType == -2) { //第一次加载不做动画
                this.node.setScale(1,0);
                this._updataByType(data);
                return;
            }
            var scale = cc.scaleTo(0.2, 1, 0);
            this.node.runAction(cc.sequence(scale, cc.callFunc(this._updataByType.bind(this, data), this)));
        }else { //修改数据
            this._changeView(data);
        }
    },

    _updataByType:function(data){
        if(data.type == -1) return; //修改的是隐藏 则不显示
        var scale = cc.scaleTo(0.2, 1, 1);
        this.node.runAction(cc.sequence(cc.callFunc(this._changeView.bind(this, data), this), scale));
    },

    _changeView:function(data){
        data.preType = data.type; //记录现在的type
        this.nameLabel.string = Util.formatName(data.name, 6);
        this.pointLabel.string = Util.bigNumToStr(data.point);
        this.scoreLabel.string = Util.bigNumToStr(data.score);
        if(data.type == 0 || data.type == 1){
            this._pouringBtns.active = true;
            this.bankerPanel.active = false;
            this.updateBetBtns(data[data.type]);
        } else { //玩家坐庄
            this._pouringBtns.active = false;
            this.bankerPanel.active = true;
            this.gainLabel.string = Util.bigNumToStr2(data[data.type].gain);
            this.loseLabel.string = Util.bigNumToStr2(data[data.type].lose);
            this.totalLabel.string = Util.bigNumToStr2(data[data.type].total);
        }
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
        this._betBtns[0].getComponent('BetBtn').setAttr('_isSelect', true);
        HundredData['handlePanel'].selectValue = this._betBtns[0].getComponent('BetBtn')._value;
    },

    _handleClick:function(event){
        if(!event.currentTarget.getComponent('BetBtn')._isActive)return;
        for(var k in this._betBtns){
            if(this._betBtns[k] === event.currentTarget){
                event.currentTarget.getComponent('BetBtn').setAttr('_isSelect', true);
                console.log(HundredData['handlePanel'].selectValue);
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
