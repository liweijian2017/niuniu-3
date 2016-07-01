//庄家座位
// var BaseComponent = require('BaseComponent');
var Util = require('Util');
var HundredData = require('HundredData');

cc.Class({
    extends: cc.Component,

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
        HundredData._findData('name');

        this.nameLabel = this.node.getChildByName('name');
        this.imgSprite = this.node.getChildByName('img');
        this.handle = HundredData.bindCallF('banker', this._updateView.bind(this));
    },
    //更新显示
    _updateView:function(data){
        this.getComponent('UserComponent').setUserData(data.name, data.point, data.img);
    },

});
 