//庄家座位
var BaseComponent = require('BaseComponent');
var Util = require('Util');
cc.Class({
    extends: BaseComponent,

    properties: {
        id:-1, //默认-1, 庄家座位id为0
        _isHold:true,
        _nameStr:'', //name
        _imgUrl:'',//头像地址
        _point:0, //筹码数
        _oldPoint:0,
        pointLabel:{
            default:null,
            type:cc.Node
        }
    },

    onLoad: function () {
        this._isChange = true;
        this.nameLabel = this.node.getChildByName('name');
        this.imgSprite = this.node.getChildByName('img');
    },

    _updateNode:function(){
        if(!this._isHold){
            this.nameLabel.active = false;
            this.pointLabel.active = false;
            this.imgSprite.active = false;
            return;
        }else{
            this.nameLabel.active = true;
            this.pointLabel.active = true;
            this.imgSprite.active = true;
        }
        if(this._nameStr)
            this.nameLabel.getComponent(cc.Label).string = Util.formatName(this._nameStr);
        if(this._point != this._oldPoint){
            this.pointLabel.getComponent(cc.Label).string = Util.bigNumToStr(this._point);
            //TODO 数值浮动
            this._oldPoint = this._point;
        }
    },

    setData:function(data){
        this._nameStr = data.name;
        this._point = data.point;
        this._imgUrl = data.img;
        this._updateNode();
    },
});
 