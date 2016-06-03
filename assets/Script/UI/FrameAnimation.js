//帧动画类
cc.Class({

    properties: {
        sprite:null, //动画主角
        interval:0.2, //时间间隔
        loop:false, //是否循环
        cb:null, //回调函数(动画播放结束),
        frameList:[], //纹理集合
        stopFlag:false, //动画开关
    },

    ctor:function(sprite){
        this.sprite = sprite;
    },
    //动画开始
    run:function(){
        // cc.director.getScheduler().scheduleOnce(function(){

        // }, this, interval, !this._isRunning);
    },
    //停止动画
    stop:function(){
        this.stopFlag = true;
    },

    //添加动画帧
    addFrame:function(frame){
        this.frameList.push(frame);
    },
});
