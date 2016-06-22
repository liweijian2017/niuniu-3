//页面切换效果
cc.Class({
    extends: cc.Component,

    properties: {
        inType:-1, //进入动画
        outType:-1, //移除动画
    },

    onLoad: function () {
    },

    onDestroy:function(){
        this.unscheduleAllCallbacks();
    },
    
    _getInAction:function(){
        var action = null;
        switch(this.inType){
            case -1:
                break;
            case 0: //右侧进入
                this.node.x = 500;
                action = cc.moveTo(0.5, cc.p(0,0)).easing(cc.easeBackOut());
                break;
            case 1: //弹出
                this.node.setScale(0.2);
                action = cc.scaleTo(0.5, 1).easing(cc.easeBackOut());
                break;
            default:
                break;
        }
        return action;
    },

    _getOutAction:function(){
        var action = null;
        switch(this.outType){
            case -1:
                break;
            case 0: //左侧滑出
                action = cc.moveTo(0.5, cc.p(-500,0)).easing(cc.easeBackOut());
                break;
            case 1: //缩小
                action = cc.scaleTo(0.5, 0).easing(cc.easeElasticIn(8.0));
                break;
            default:
                break;
        }
        return action;
    },

    _showNode:function(){
        var action = this._getInAction();
        if(action){
            this.node.runAction(action);
            return;
        }
    },

    _hideNode:function(){
        var action = this._getOutAction();
        if(action){ //如果预设了动画
            var fun = function(node){
                node.active = false;
            }.bind(this, this.node);
            this.node.runAction(cc.sequence(action, cc.callFunc(fun, this)));
            return;
        }
        this.node.active = false;
    },

    //显示节点以对应的动画方式
    show:function(type){
        if(type) this.inType = type;
        this._showNode();
    },
    //隐藏节点以对应的动画方式
    hide:function(type){
        if(type) this.outType = type;
        this._hideNode();
    },
    //定时的隐藏节点
    timingHide:function(type, time){ //TODO 定时器处理
        if(type) this.outType = type;
        return this.scheduleOnce(function() {
            this._hideNode();
        }, time);
    },

});
