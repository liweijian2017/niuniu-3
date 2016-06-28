//庄家座位
var BaseComponent = require('BaseComponent');
var Util = require('Util');
cc.Class({
    extends: BaseComponent,

    properties: {
        id:-1, //默认-1, 庄家座位id为0
        _isHold:true,
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
    },

    setData:function(data){
        this.getComponent('UserComponent').setUserData(data.name, data.point, data.img);
    },
});
 