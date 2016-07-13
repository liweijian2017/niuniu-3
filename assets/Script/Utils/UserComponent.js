var BaseComponent = require('BaseComponent');
var Util = require('Util');
var ImageLoader = require('ImageLoader');
cc.Class({
    extends: BaseComponent,

    properties: {
        pointType:0, //0:数值正常显示  1:数值正负显示
        _nick:'', //昵称
        _point:0, //筹码数
        _img:'', //头像地址
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
    },

    onLoad: function () {
        this._isChange = true;
        if(this._init)this._init()
    },

    _updateNode:function(){
        if(this._nick)
            this.nameLabel.string = Util.formatName(this._nick, 6);
        if(this.pointType == 0){ //处理数值
            this.pointLabel.string = Util.bigNumToStr(this._point);
        }else if(this.pointType == 1){
            var str = Util.bigNumToStr2(this._point);
            if(this._point > 0 ) str = '+' + str;
            this.pointLabel.string = str;
        }else {
            this.pointLabel.string = Util.bigNumToStr(this._point);
        }
        if(this._img){
            var self = this;
            ImageLoader.load(this._img, function(ret, node){
                if(ret) {
                    self.imgSprite.spriteFrame = node.getComponent(cc.Sprite).spriteFrame;  
                }              
            });
        }
    },
    //设置数据
    setUserData:function(nick, point, img){
        this._nick = nick;
        this._point = point;
        if(img instanceof cc.SpriteFrame)
            this.imgSprite.spriteFrame = img;
        else {
            this._img = img;
        }
        this._updateNode();
    },
    //移除数据
    removeUserData:function(){
        this._nick = '';
        this._point = 0;
        this._img = '';
        this._updateNode();
    },
    //设置金币
    setPoint:function(point){
        var change = point - this._point;
        this._point = point;
        this._updateNode();
        if(change == 0) return;
        var label = new cc.Node();
        label.addComponent(cc.Label);
        label.color = new cc.Color(255, 255, 0);
        label.getComponent(cc.Label).fontSize = 18;

        label.getComponent(cc.Label).string = (change > 0 ? "+" : "-") + Util.bigNumToStr(Math.abs(change));
        label.opacity = 0;
        // label.parent = this.node;
        this.node.addChild(label, 1000, 1000);
        var pt = this.pointLabel.node.getPosition();
        // pt.x = pt.x + 40;
        pt.y = pt.y + 20;
        label.setPosition(pt);
        label.runAction(cc.sequence(cc.fadeIn(0.1), cc.delayTime(0.3), cc.moveBy(0.8, 0, 30), cc.fadeOut(0.2), cc.callFunc(function(){
            this.removeFromParent();
        }, label)));
    },

    setName:function(nick){
        this._nick = nick;
        this._updateNode();
    },

    setHeadImg:function(img){
        this._img = img;
        this._updateNode();
    }

});
