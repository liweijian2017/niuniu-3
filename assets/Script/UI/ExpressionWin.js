var Router = require('Router');
cc.Class({
    extends: cc.Component,

    properties: {
        layout:{
            default:null,
            type:cc.Layout
        },
        spriteAtlas:{ //图集
            default:null,
            type:cc.SpriteAtlas
        },
        expressionPrefab:{
            default:null,
            type:cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {
        Router.expressionAtlas = this.spriteAtlas;
        this.scheduleOnce(function(){ //下一帧立即执行
            for(var i=1; i<=27; i++){
                var expression = cc.instantiate(this.expressionPrefab);
                expression.getComponent('Expression').init(i);
                this.layout.node.addChild(expression);
            }
        }, 0);
        
    },

    start:function(){
        this.node.active = false;
    }
});
