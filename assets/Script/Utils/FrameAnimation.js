//帧动画类
cc.Class({
    extends: cc.Component,
    properties: {
        count:0,
        loopNum:2, //有限循环次数
        sprite:null, //动画主角
        interval:0.3, //时间间隔
        loop:false, //是否无限循环
        cb:null, //回调函数(动画播放结束),
        frameList:[], //纹理集合
        stopFlag:true, //动画开关
        spriteAtlas:{ //动画纹理
            default:null,
            type:cc.SpriteAtlas
        }
    },
    onLoad:function(){
        this.updateTimer = 0;
    },
    //初始化
    init:function(spriteAtlas, frameName){
        //初始化第一帧
        this.spriteAtlas = spriteAtlas;
        this.sprite = this.node.addComponent(cc.Sprite);
        // this.sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        var frame = this.sprite.spriteFrame = spriteAtlas.getSpriteFrame(frameName);
        this.addFrame(frame);
    },
    //动画开始
    run:function(cb){
        this.stopFlag = false;
        if(cb)this.cb = cb;
    },
    //停止动画
    stop:function(){
        this.stopFlag = true;
    },
    //添加动画帧
    addFrame:function(frame){
        this.frameList.push(frame);
    },
    //自动加载帧; 前提:所有帧name都是递推的
    autoAddFrame:function(name, num){
        var count = num;
        var frame = this.spriteAtlas.getSpriteFrame(name + count); //拿到第一个
        while(frame) {
            this.addFrame(frame);
            count ++ ;
            frame = this.spriteAtlas.getSpriteFrame(name + count);//更新
        }
    },
    update:function(dt){
        //是否启动动画
        if(this.stopFlag)return;
        //帧数
        this.updateTimer += dt;
        if (this.updateTimer < this.interval) return;
        this.updateTimer = 0;
        if(this.count == this.frameList.length*this.loopNum) {//结束条件
            if(this.loop){ //直接进入下一帧
                this.count = 0;
                return;
            } 
            if(this.cb)this.cb(); //执行回调
            this.stopFlag = true; //停止动画
            return;
        }
        this.sprite.spriteFrame = this.frameList[(this.count%this.frameList.length)];//切换纹理
        this.count++;
    }
});
