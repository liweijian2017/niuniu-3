//下注按钮
var Util = require('Util');
var BaseComponent = require('BaseComponent');
cc.Class({
    extends: BaseComponent,
    properties: {
        _type:0,//类型
        _value:0, //按钮的下注数值
        _isActive:true,//是否激活
        _isSelect:false, //是否被选中
        _spriteAtlas:null, //图集
        valueLabel:{ 
            default:null,
            type:cc.Label
        },
        lightNode:{ 
            default:null,
            type:cc.Node
        },
    },

    onLoad: function () {
        this._isChange = true; //按照默认值更新一次
    },
    //设置图集
    setSpriteAtlas:function(spriteAtlas){
        this._spriteAtlas = spriteAtlas;
    },
    _updateNode:function(){
        this.valueLabel.string = Util.bigNumToStr2(this._value);
        this.node.opacity = (this._isActive == true) ? 255 : 100;
        this.lightNode.active = this._isSelect;
        if(this._spriteAtlas)
            this.node.getComponent(cc.Sprite).spriteFrame = this._spriteAtlas.getSpriteFrame('btn_bairen' + (this._type+1));
    },

});
