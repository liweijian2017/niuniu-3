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
        this._resultType = this.node.getChildByName('ResultType');
        this.nameLabel = this.node.getChildByName('name');
        this.imgSprite = this.node.getChildByName('img');
        HundredData.bindCallF('banker:isShowPokerType', this._updateIsShowPokerType.bind(this));
        HundredData.bindCallF('banker:point', this._updatePoint.bind(this));
        HundredData.bindCallF('banker:name', this._updateName.bind(this));
    },
    //更新显示
    _updateView:function(data){
        this.getComponent('UserComponent').setUserData(data.name, data.point, data.img);
        return data;
    },

    _updatePoint:function(point){
        this.getComponent('UserComponent').setPoint(point);
        return point;
    },

    _updateName:function(name){
        this.getComponent('UserComponent').setName(name);
        return name;
    },

    _updateIsShowPokerType:function(isShow){
        this._resultType.active = isShow;
        if(isShow){//设置牌型
            this._resultType.getComponent('CardTypeParse').setData(HundredData['banker'].cardType);
        }
        return isShow;
    },

});
 