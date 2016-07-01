var BaseComponent = require('BaseComponent');
var Util = require('Util');
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
        // TODO 头像处理
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
    },
    //设置数据
    setUserData:function(nick, point, img){
        this._nick = nick;
        this._point = point;
        if(img instanceof cc.SpriteFrame)
            this.imgSprite.spriteFrame = img;
        else {
            this._img = img;
            // throw new Error("头像设置出错:" + img);
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

});
