var Game = require('Game');
var Router = require('Router');

//表情对象
cc.Class({
    extends: cc.Component,

    properties: {
        id:-1, //默认为-1
        spriteAtlas:{ //图集
            default:null,
            type:cc.SpriteAtlas
        },
        sprite:{
            default:null,
            type:cc.Sprite,
        }
    },

    onLoad: function () {
        this.sprite.node.on(cc.Node.EventType.TOUCH_END, this.sendExpression, this);
        this.sprite.node.on(cc.Node.EventType.MOUSE_DOWN, this.sendExpression, this);
    },
    //初始化表情
    init:function(id){
        this.id = id;
        this.updateSprite();
    },

    //更新自己的显示
    updateSprite:function(){
        if(this.id > 0){
            this.sprite.spriteFrame = this.spriteAtlas.getSpriteFrame('expression-'+ this.id);
        }
    },

    //发送表情
    sendExpression:function(event){
        Game.socket.sendExpression(this.id);
        if(Router.tabel){
            Router.tabel.closeExpressionWin();
        }
    },

});
