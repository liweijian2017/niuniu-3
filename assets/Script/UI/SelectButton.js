cc.Class({
    extends: cc.Component,

    properties: {
        id:0
    },

    onLoad: function () {
        //添加好按钮禁用背景图片
        // var sp = this.node.getComponent(cc.Sprite);
        // var button = this.node.getComponent(cc.Button);
        // console.log(sp);
    },
    
    //发送叫庄选择
    handleEvent:function(){
        var event =  new cc.Event.EventCustom('SELECT_MULTIPLE', true);
        event.setUserData({msg:this.id});
        this.node.dispatchEvent(event);
    },
    
    //发送倍数选择
    handlePlayerMultiple:function(){
        var event =  new cc.Event.EventCustom('PLAYER_SELECT_MULTIPLE', true);
        event.setUserData({msg:this.id});
        this.node.dispatchEvent(event);
    },
    
    //发送计算选择结果事件
    handleCountEvent:function () {
        var event =  new cc.Event.EventCustom('COUNT_HANDLEPOKER', true);
        event.setUserData({msg:this.id});//0有牛按钮 1没牛按钮
        this.node.dispatchEvent(event);
    },

    //发送榜单切换事件
    // handleChengeListEvent:function(){
    //     var event =  new cc.Event.EventCustom('CHANGE_LIST', true);
    //     event.setUserData({msg:this.id});//0财富榜 1积分榜
    //     this.node.dispatchEvent(event);
    // }
    
});
