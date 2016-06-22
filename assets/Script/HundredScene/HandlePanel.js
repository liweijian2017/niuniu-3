var Util = require('Util');
var BaseComponent = require('BaseComponent');
cc.Class({
    extends: BaseComponent,

    properties: {
        _nameStr:'',
        _point:0,
        _oldPoint:0, //变动前的积分
        _score:0,
        _isSit:true, //是否坐下
        _selectValue:0, //当前选择的数值
        _betBtns:[],
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
    },

    onLoad: function () {
        console.log('百人场-启动-操控面板...');
        this._isChange = true;
        this._pouringBtns = this.node.getChildByName('PouringBtns'); //下注按钮容器
        
        var standBetValue = [100, 1000, 5000, 10000, 100000];
        var sitBetValue = [1000, 10000, 50000, 100000, 1000000];
        this._betValues = (this._isSit == true) ? sitBetValue : standBetValue;
        for(var i=0; i<5; i++){
            var betBtn = cc.instantiate(this.betBtnPrefab);
            betBtn.getComponent('BetBtn').setSpriteAtlas(this.spriteAtlas);
            betBtn.getComponent('BetBtn').setAttr('_type', i);
            betBtn.getComponent('BetBtn').setAttr('_value', this._betValues[i]);
            betBtn.parent = this._pouringBtns;
            betBtn.on(cc.Node.EventType.TOUCH_END, this._handleClick.bind(this), this);
            this._betBtns.push(betBtn);
        }
        this._betBtns[0].getComponent('BetBtn').setAttr('_isSelect', true);
        this._selectValue = this._betBtns[0].getComponent('BetBtn')._value;
    },

    _updateNode:function(){
        for(var k in this._betBtns){
            this._betBtns[k].getComponent('BetBtn').setAttr('_value', this._betValues[k]);;
        }
        this.nameLabel.string = Util.formatName(this._nameStr, 6);
        if(this._point != this._oldPoint){
            this.pointLabel.string = Util.bigNumToStr(this._point);
            //TODO 数值浮动
            this._oldPoint = this._point;
        }
        this.scoreLabel.string = Util.bigNumToStr(this._score);
    },

    _handleClick:function(event){
        if(!event.currentTarget.getComponent('BetBtn')._isActive)return;
        for(var k in this._betBtns){
            if(this._betBtns[k] === event.currentTarget){
                event.currentTarget.getComponent('BetBtn').setAttr('_isSelect', true);
                this._selectValue = event.currentTarget.getComponent('BetBtn')._value;
            }else {
                this._betBtns[k].getComponent('BetBtn').setAttr('_isSelect', false);
            }
        }
    },
    //设置自己的数据,进入操控面板
    setData:function(data){
        this._nameStr = data.name;
        this._point = data.point;
        this._score = data.score;
        this._updateNode();
    },

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
