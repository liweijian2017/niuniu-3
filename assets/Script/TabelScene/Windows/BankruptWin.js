//破产弹框组件
cc.Class({
    extends: cc.Component,

    properties: {
        cb:null,
        pointLabel:{
            default:null,
            type:cc.Label
        },
        textLabel:{
            default:null,
            type:cc.Label
        },
    },
    onLoad: function () {
        console.log('破产弹框加载成功!');
    },
    //处理
    handleWithPack:function(pack){
        console.log('处理对应的包');
    },
    //处理回调函数
    setCallBack:function(cb){
        this.cb = cb;
    },
    setPoint:function(point, num){
        this.pointLabel.string = point||'';
        this.textLabel.string = '今天剩余补助领取次数:' + num||0;
    },
    //处理点击
    handleEvent:function(){
        if(this.cb)this.cb();
    },
    closeSelf:function(){
        this.node.removeFromParent();
    },

}); 
