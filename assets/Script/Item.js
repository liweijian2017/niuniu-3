var Util = require('Util');
cc.Class({
    extends: cc.Component,

    properties: {
        headImg:{
            default:null,
            type:cc.Node
        },
        nameLabel:{
            default:null,
            type:cc.Label
        },
        changeLabel:{
            default:null,
            type:cc.Label
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    //初始化数据url, name, change
    initData:function (data) {
        this.headImg.getComponent(cc.Sprite).spriteFrame = data.img;
        this.nameLabel.string = Util.formatName(data.name, 6);
        this.changeLabel.string = data.change >= 0 ? ('+' + Util.bigNumToStr2(data.change)) : Util.bigNumToStr2(data.change); 
    }
    
});
