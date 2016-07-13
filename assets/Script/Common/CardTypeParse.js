cc.Class({
    extends: cc.Component,

    properties: {
        spriteAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        one:{
            default:null,
            type:cc.Sprite
        },
        two:{
            default:null,
            type:cc.Sprite
        },
        three:{ //好牌显示
            default:null,
            type:cc.Sprite
        },
    },

    onLoad: function () {

    },

    setData:function(cardType) {
        this.one.node.active = true;
        this.two.node.active = true;
        this.three.node.active = true;
        var key1 = "fnt_mei";
        var key2 = "fnt_niu2";
        if(cardType === 0) { //没牛
            key1 = "fnt_mei";
            key2 = "fnt_niu2";
        }else if(cardType === 10) { //牛牛
            key1 = "fnt_niu";
            key2 = "fnt_niu";
        }else if(cardType>0 && cardType<10){ //普通牛
            key1 = "fnt_niu2";
            key2 = "fnt_"+cardType;
        }else {
            this.one.node.active = false;
            this.two.node.active = false;
        }
        this.one.spriteFrame = this.spriteAtlas.getSpriteFrame(key1);
        this.two.spriteFrame = this.spriteAtlas.getSpriteFrame(key2);
        var key = '';
        if(cardType == 11){ //顺
            key = "fnt_niu_shunzi";
        }else if(cardType == 12){ //三带一对
            key = "fnt_niu_sandai";
        }else if(cardType == 13){ //全小
            key = "fnt_niu_xiao";
        }else if(cardType == 14){ //全大
            key = "fnt_niu_quanda";
        }else if(cardType == 15){ //炸弹
            key = "fnt_niu_zhadan";
        }else {
            this.three.node.active = false;
        }
        var spriteFrame = this.spriteAtlas.getSpriteFrame(key);
        if(key !== '' && spriteFrame) {
            this.three.spriteFrame = spriteFrame;
        }
    },

});
