//页面切换效果
cc.Class({
    extends: cc.Component,

    properties: {
        inType:-1, //进入动画
        inTime:0.5,
        outTime:0.5,
        outType:-1, //移除动画
    },

    onLoad: function () {
    },

    onEnable:function(){
        // this.unscheduleAllCallbacks();
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
                action = cc.moveTo(this.inTime, cc.p(0,0)).easing(cc.easeBackOut());
                break;
            case 1: //中心弹出
                action = cc.scaleTo(this.inTime, 1).easing(cc.easeBackOut());
                break;
            case 2: //节点顶部扩张开
                var scaleTo = cc.scaleTo(this.inTime, 1, 1).easing(cc.easeBackOut());
                action = cc.sequence(scaleTo, cc.callFunc(function(){
                }, this));
                break;
            default:
                break;
        }
        return action;
    },
    //动画执行前,得初始化所有状态
    _initInState:function(node){
        switch(this.inType){
            case -1:
                break;
            case 0: //右侧进入
                this.node.x = 500;
                break;
            case 1: //中心弹出
                this.node.setScale(0.2);
                break;
            case 2: //节点顶部扩张开
                this.node.setScale(1, 0);
                break;
            default:
                break;
        }
    },
    _getOutAction:function(){
        var action = null;
        switch(this.outType){
            case -1:
                break;
            case 0: //左侧滑出
                action = cc.moveTo(this.outTime, cc.p(-500,0)).easing(cc.easeBackOut());
                break;
            case 1: //中心缩小
                action = cc.scaleTo(this.outTime, 0).easing(cc.easeElasticIn(8.0));
                break;
            case 2: //
                this.node.anchorY = 1;
                action = cc.scaleTo(this.outTime, 1, 0);
                break;
            default:
                break;
        }
        return action;
    },
    //动画执行前,得初始化所有状态
    _initOutState:function(node){
        switch(this.inType){
            case -1:
                break;
            case 0: //右侧进入
                this.node.x = 0;
                break;
            case 1: //中心弹出
                this.node.setScale(1);
                break;
            case 2: //节点顶部扩张开
                this.node.anchorY = 0.5;
                this.node.setScale(1, 1);
                break;
            default:
                break;
        }
    },

    _showNode:function(){
        var action = this._getInAction();
        if(action){
            this.node.runAction(action);
            return;
        }
    },

    _hideNode:function(cb){
        var action = this._getOutAction();
        if(action){ //如果预设了动画
            var fun = function(node){
                if(cb)cb();
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
        this._initInState();
        this._showNode();
    },
    //隐藏节点以对应的动画方式
    hide:function(type){
        if(type) this.outType = type;
        this._initOutState();
        this._hideNode();
    },
    //定时的隐藏节点
    timingHide:function(type, time, cb){ //定时器处理
        if(type) this.outType = type;
        this.unscheduleAllCallbacks();
        return this.scheduleOnce(function() {
            this._initOutState();
            this._hideNode(cb);
        }, time);
    },

});
