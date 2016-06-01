//广播信息对象
var BroadcastReceiver = require('BroadcastReceiver');

cc.Class({
    extends: cc.Component,
    properties: {
        cb:null,
        numberOfTime:0, //默认为0
        initialX:null, //初始位置
        content:{
            default:null,
            type:cc.Node
        },
        message:{
            default:null,
            type:cc.Label
        },
    },
    onLoad: function () {
        this.distance = cc.director.getWinSizeInPixels().width/2;
        this.initialX = this.content.x;
    },

    init:function(str, cb){
        this.message.string = str;
        if(cb)this.cb = cb;
    },

    //循环次数
    setNumberOfTime:function(numberOfTime){
        this.numberOfTime = numberOfTime;
    },

    update:function(dt){
        if(this.content.x > - this.content.width - this.distance){
            this.content.x -= 2;
        }else{
            if(this.numberOfTime <= 1){
                this.node.removeFromParent();
                if(this.cb)this.cb();
            }else {
                this.numberOfTime --;
                this.content.x = this.initialX;
            }
        }
    },

    onDestroy:function(){
        BroadcastReceiver.isRun = false;
    }
});
