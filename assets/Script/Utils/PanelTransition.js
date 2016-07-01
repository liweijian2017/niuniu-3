cc.Class({
    extends: cc.Component,

    properties: {
        duration: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.outOfWorld = cc.p(3000, 0); 
        this.node.position = this.outOfWorld;
        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let cbFadeIn = cc.callFunc(this.onFadeInFinish, this);
        
        var action = cc.scaleTo(this.duration, 1.0);
        action.easing(cc.easeBackOut()); 
        this.actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(this.duration, 255), action), cbFadeIn);
        // this.actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(0.01, 0)), cbFadeOut);
        this.node.on('fade-in', this.startFadeIn, this);
        this.node.on('fade-out', this.startFadeOut, this);
    },

    startFadeIn: function () {
        this.node.active = true;
        // cc.eventManager.pauseTarget(this.node, true); //停止该节点的所有时间监听
        this.node.position = cc.p(0, 0); //设置位置
        this.node.setScale(0.1); //设置大小
        this.node.opacity = 255; //透明度
        this.node.runAction(this.actionFadeIn);  //执行动画
    },

    startFadeOut: function () {
        // cc.eventManager.pauseTarget(this.node, true);
        this.node.active = false;
        //this.node.runAction(this.actionFadeOut);
    },

    onFadeInFinish: function () {
        cc.eventManager.resumeTarget(this.node, true);
    },

    onFadeOutFinish: function () {
        this.node.position = this.outOfWorld;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
