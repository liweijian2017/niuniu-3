var BaseComponent = require('BaseComponent');
var Util = require('Util');
cc.Class({
    extends: BaseComponent,

    properties: {
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
        if(this._point>0){
            this.pointLabel.string = Util.bigNumToStr(this._point);
        }else {
            this.pointLabel.string = Util.bigNumToStr2(this._point);
        }
    },
    //设置数据
    setUserData:function(nick, point, img){
        this._nick = nick;
        this._point = point;
        this._img = img;
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
