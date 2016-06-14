//页面切换效果
cc.Class({
    extends: cc.Component,

    properties: {
        inType:-1, //默认没有动画
        outType:-1,
    },

    // use this for initialization
    onLoad: function () {
    },
    show:function(type){
        if(type) this.inType = type;
        this.showNode();
    },
    hide:function(type){
        if(type) this.outType = type;
        this.hideNode();
    },
    getInAction:function(){
        var action = null;
        switch(this.inType){
            case -1:
                break;
            case 0: //右侧进入
                this.node.x = 500;
                action = cc.moveTo(0.5, cc.p(0,0)).easing(cc.easeBackOut());
                break;
            case 1: //弹出
                this.node.setPosition(0,0);
                this.node.setScale(0.2);
                action = cc.scaleTo(0.5, 1).easing(cc.easeBackOut());
                break;
            default:
                break;
        }
        return action;
    },

    getOutAction:function(){
        var action = null;
        switch(this.outType){
            case -1:
                break;
            case 0: //左侧滑出
                action = cc.moveTo(0.5, cc.p(-500,0)).easing(cc.easeBackOut());
                break;
            default:
                break;
        }
        return action;
    },

    showNode:function(){
        var action = this.getInAction();
        if(action){
            this.node.runAction(action);
            return;
        }
    },

    hideNode:function(){
        var action = this.getOutAction();
        if(action){ //如果预设了动画
            var fun = function(node){
                node.active = false;
            }.bind(this, this.node);
            this.node.runAction(cc.sequence(action, cc.callFunc(fun, this)));
            return;
        }
        this.node.active = false;
    },

});
