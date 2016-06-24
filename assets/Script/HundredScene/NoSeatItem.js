var BaseComponent = require('BaseComponent');
var Util = require('Util');
cc.Class({
    extends: BaseComponent,

    properties: {
        _orderId:-1, //默认为无座item,有序为上庄item
        _readyBuyin:0, //准备上庄的金币
        _nameStr:'',
        _point:0,
        _imgUrl:'',
        imgSprite:{
            default:null,
            type:cc.Sprite
        },
        nameLabel:{
            default:null,
            type:cc.Label
        },
        pointLabel:{
            default:null,
            type:cc.Label
        },
        orderLabel:{ //等待顺序
            default:null,
            type:cc.Label
        },
        bankerIcon:{ //专家标识
            default:null,
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this._isChange = true;
    },
    //初始化
    init:function(user){
        this._nameStr = user.nick;
        this._point = user.buyinChips;
        if(user.readyBuyin)this._readyBuyin = user.readyBuyin;
        this._imgUrl = user.img;
        this._updateNode();
    },

    _updateNode:function(){
        this.nameLabel.string = this._nameStr;
        if(this._orderId < 0){ //无座item
            this.orderLabel.node.active = false;
            this.bankerIcon.active = false;
            this.pointLabel.string = Util.bigNumToStr(this._point);
        }else if(this._orderId == 0){ //以下是上庄item
            this.bankerIcon.active = true;
            this.orderLabel.node.active = false;
            this.pointLabel.string = Util.bigNumToStr(this._readyBuyin);
        }else {
            this.pointLabel.string = Util.bigNumToStr(this._readyBuyin);
            this.bankerIcon.active = false;
            this.orderLabel.node.active = true;
            this.orderLabel.string = this._orderId;
        }
    },
});
