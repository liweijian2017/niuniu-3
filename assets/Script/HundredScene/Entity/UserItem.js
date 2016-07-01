//listItem 列表item
var BaseComponent = require('BaseComponent');
var Util = require('Util');
cc.Class({
    extends: BaseComponent,

    properties: {
        _data:null,
        _orderId:-1, //默认为无座item,有序为上庄item
        _readyBuyin:0, //准备上庄的金币
        orderLabel:{ //等待顺序
            default:null,
            type:cc.Label
        },
        bankerIcon:{ //专家标识
            default:null,
            type:cc.Node
        },
    },
    onLoad: function () {
        this._isChange = true;
    },
    //初始化
    init:function(user){
        this._data = user;
        if(user.readyBuyin)this._readyBuyin = user.readyBuyin;
        this._updateNode();
    },

    _updateNode:function(){
        this.getComponent('UserComponent').setAttr('_nick', this._data.nick);
        if(this._orderId < 0){ //无座item
            this.orderLabel.node.active = false;
            this.bankerIcon.active = false;
            this.getComponent('UserComponent').setAttr('_point', this._data.buyinChips);
        }else if(this._orderId == 0){ //以下是上庄item
            this.bankerIcon.active = true;
            this.orderLabel.node.active = false;
            this.getComponent('UserComponent').setAttr('_point', this._readyBuyin);
        }else {
            this.getComponent('UserComponent').setAttr('_point', this._readyBuyin);
            this.bankerIcon.active = false;
            this.orderLabel.node.active = true;
            this.orderLabel.string = this._orderId;
        }
    },
});
