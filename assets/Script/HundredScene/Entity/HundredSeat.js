//百人场座位
var BaseComponent = require('BaseComponent');
var Util = require('Util');
var HundredData = require('HundredData');

cc.Class({
    extends: BaseComponent,

    properties: {
        id:-1, //座位id
        _isHold:false, //座位上是否有人
        _oldPoint:0,
    },

    onLoad: function () {
        this._isChange = true;
        console.log('百人场-初始化座位:' + this.id);
        this.nameLabel = this.node.getChildByName('name');
        this.pointLabel = this.node.getChildByName('point');
        this.imgSprite = this.node.getChildByName('img');
        this.nullSprite = this.node.getChildByName('null');
        this.node.on(cc.Node.EventType.TOUCH_END, this._handleClick.bind(this), this);
        this.handle = HundredData.bindCallF('seats:'+ this.id, this._updateView.bind(this));
        HundredData.bindCallF('seats:'+ this.id + ':isHold', this._updateNode.bind(this));
    },

    _updateView:function(data){
        this.getComponent('UserComponent').setUserData(data.name, data.point, data.img);
    },

    _updateNode:function(data){
        if(!data){
            this.nameLabel.active = false;
            this.pointLabel.active = false;
            this.imgSprite.active = false;
            this.nullSprite.active = true;
            return;
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
        return data;
    },
    //站起
    standUp:function(){
        this.getComponent('UserComponent').removeUserData();
        this.nameLabel.runAction(cc.moveBy(0.5, 0, 30).easing(cc.easeBackOut()));
        this.imgSprite.runAction(cc.moveBy(0.5, 0, 30).easing(cc.easeBackOut()));
        this.pointLabel.runAction(cc.moveBy(0.5, 0, 30).easing(cc.easeBackOut()));
        
        this.scheduleOnce(function(){
            this._updateNode(); //刷新显示
            this.nameLabel.y -= 30;
            this.imgSprite.y -= 30;
            this.pointLabel.y -= 30;
        } ,0.2);
    },
    //申请坐下
    _handleClick:function(event){
        console.log(HundredData['seats'][this.id].isHold);
        if(HundredData['seats'][this.id].isHold){
            HundredData['seats'][this.id].isHold = false;
        }else {
            HundredData['seats'][this.id].isHold = true;
        }
        // if(!this._isHold){
        //     console.log('百人场-申请坐下:' + this.id);
        //     this.sitDown({name:'Dall', point:1000, img:''});
        // }else {
        //     this.standUp();
        // }
    },

    executingGoldAni:function(){
        console.log('asdfasdfasfasdfasdf');
    },
});
