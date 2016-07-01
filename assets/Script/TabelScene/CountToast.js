//倒计时显示器(可以设置文字,和位置)
cc.Class({
    extends: cc.Component,
    
    properties: {
        duration:0, //持续时间
        content:'', //提示内容
        textLable:{
            default:null,
            type:cc.Label
        },
        countDown:{
            default:null,
            type:cc.Node
        }
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
    setContent:function (content) {
        this.content = content;
    },

    setStartPos: function(pos){
        this.startPosition = pos;
    },
    
    startFadeIn: function () {
        cc.eventManager.pauseTarget(this.node, true); //停止该节点的所有时间监听
        this.node.position = this.startPosition||cc.p(0,0); //设置位置
        this.textLable.string = this.content;
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
    
    show:function(time, flag, cb){
        this.node.emit('TOAST_IN'); //出现toast
        var self = this;
        if(flag && flag == true){ //是否显示倒计时
            this.countDown.active = false;
        }
        //开始倒计时
        this.countDown.getComponent('CountDown').begin(time, function () {
            self.hide();
            if(cb)cb();
        });;
    },
    
    hide:function(){
        this.node.emit('TOAST_OUT');
    },
    
    onDestroy:function () {
        this.node.off('TOAST_IN',  this.startFadeIn, this);
        this.node.off('TOAST_OUT', this.startFadeIn, this);
    },
    
});
