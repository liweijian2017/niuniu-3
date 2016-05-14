cc.Class({
    extends: cc.Component,
    
    properties: {
        type:0, //类型0:短时间显示(自己消失),  1:长时间显示
        duration:0, //持续时间
        content:'', //提示内容
    },

    onLoad: function () {
        this.outOfWorld = cc.p(3000, 0); 
        this.node.position = this.outOfWorld;
        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let cbFadeIn = cc.callFunc(this.onFadeInFinish, this);
        this.actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(this.duration, 200), cc.scaleTo(this.duration, 1.0)), cbFadeIn);
        this.actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(this.duration, 0), cc.scaleTo(this.duration, 1, 0)), cbFadeOut);
        this.node.on('TOAST_IN', this.startFadeIn, this);
        this.node.on('TOAST_OUT', this.startFadeOut, this);
    },

    startFadeIn: function () {
        cc.eventManager.pauseTarget(this.node, true); //停止该节点的所有时间监听
        this.node.position = cc.p(0, 0); //设置位置
        this.node.setScale(1, 0); //设置大小
        this.node.runAction(this.actionFadeIn);  //执行动画
    },

    startFadeOut: function () {
        cc.eventManager.pauseTarget(this.node, true);
        this.node.runAction(this.actionFadeOut);
    },

    onFadeInFinish: function () {
        cc.eventManager.resumeTarget(this.node, true);
    },

    onFadeOutFinish: function () {
        this.node.position = this.outOfWorld;
    },
    
    show:function(){
        this.node.emit('TOAST_IN');
        this.scheduleOnce(function() {
            this.hide();
        }, 1);
    },
    
    hide:function(){
        this.node.emit('TOAST_OUT');
    }
});
