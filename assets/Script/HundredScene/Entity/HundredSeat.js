//百人场座位
var Util = require('Util');
var HundredData = require('HundredData');
var Game = require('Game');

cc.Class({
    extends: cc.Component,

    properties: {
        id:-1, //座位id
        _isHold:false, //座位上是否有人
        _oldPoint:0,
    },

    onLoad: function () {
        this._isChange = true;
        // console.log('百人场-初始化座位:' + this.id);
        this.nameLabel = this.node.getChildByName('name');
        this.pointLabel = this.node.getChildByName('point');
        this.imgSprite = this.node.getChildByName('img');
        this.nullSprite = this.node.getChildByName('null');
        this.node.on(cc.Node.EventType.TOUCH_END, this._handleClick.bind(this), this);
        HundredData.bindCallF('seats:'+ this.id + ':isHold', this._updateIsHold.bind(this));
        HundredData.bindCallF('seats:'+ this.id + ':point', this._updatePoint.bind(this));
        HundredData.bindCallF('seats:'+ this.id + ':name', this._updateName.bind(this));
        HundredData.bindCallF('seats:'+ this.id + ':img', this._updateImg.bind(this));
    },

    _updateView:function(data){
        this.getComponent('UserComponent').setUserData(data.name, data.point, data.img);
        return data;
    },

    _updatePoint:function(point){
        this.getComponent('UserComponent').setPoint(point);
        return point;
    },

    _updateIsHold:function(isHold){
        if(!isHold){ //false
            this.getComponent('UserComponent').removeUserData();
            this.nameLabel.active = false;
            this.pointLabel.active = false;
            this.imgSprite.active = false;
            this.nullSprite.active = true;  
            return isHold;
        }else{
            this.nameLabel.active = true;
            this.pointLabel.active = true;
            this.imgSprite.active = true;
            this.nullSprite.active = false;
            this.nameLabel.y += 30;
            this.nameLabel.runAction(cc.moveBy(0.5, 0, -30).easing(cc.easeBackOut()));
            this.imgSprite.y += 30;
            this.imgSprite.runAction(cc.moveBy(0.5, 0, -30).easing(cc.easeBackOut()));
            this.pointLabel.y += 30;
            this.pointLabel.runAction(cc.moveBy(0.5, 0, -30).easing(cc.easeBackOut()));
        }
        return isHold;
    },
    _updateName:function(name){
        this.getComponent('UserComponent').setName(name);
        return name;
    },
    _updateImg:function(img){
        this.getComponent('UserComponent').setHeadImg(img);
        return img;
    },
    //申请坐下
    _handleClick:function(event){
        if(HundredData['seats'][this.id].isHold)return;
        if(HundredData['currentSeatId'] < 5)return;
        Game.socket.sendSitDown_Hundred(this.id);
    },
    //收金币
    executingGoldAni:function(){
        console.log('asdfasdfasfasdfasdf');
    },
});
