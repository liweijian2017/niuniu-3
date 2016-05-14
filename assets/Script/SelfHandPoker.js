//自己的手牌类

var HandPoker = require("HandPoker");

cc.Class({
    extends: HandPoker,

    properties: {

    },

    onLoad: function () {
    },        
    //更新显示
    updatePokers:function () {
        var padding = 18;
        for(var i=0; i<this.pokers.length; i++){
            var poker = this.pokers[i];
            poker.getComponent('Poker').node.setPositionX(poker.width*i);
        }
    },
    
    //发牌给玩家
    setPokers:function (pokersData) {
        for(var i=0; i<pokersData.length; i++){
            var poker = cc.instantiate(this.pokerPrefab);
            poker.getComponent('Poker').init(pokersData[i]);
            this.pokers.push(poker);
            this.node.addChild(poker);
        }
        this.updatePokers();
    },
    
    show:function (result) {
        console.log("只记得手牌开了");
        for(var i=0; i<this.pokers.length; i++){
            var poker = this.pokers[i];
            poker.getComponent('Poker').setState(true);
        }
        
        this.result.node.active = true;
        this.result.node.zIndex = this.node.childrenCount + 10;
        var key1 = "fnt_mei.png";
        var key2 = "fnt_niu2.png";
        if(result === 0) { //没牛
            key1 = "fnt_mei.png";
            key2 = "fnt_niu2.png";
        }else if(result === 10) { //牛牛
            key1 = "fnt_niu.png";
            key2 = "fnt_niu.png";
        }else if(result>0 && result<10){ //普通牛
            key1 = "fnt_niu2.png";
            key2 = "fnt_"+result+".png";
        }else {
            this.result.node.active = false;
        }
        this.one.spriteFrame = this.spriteAtlas.getSpriteFrame(key1);
        this.two.spriteFrame = this.spriteAtlas.getSpriteFrame(key2);
        
    },
    //添加用户点击手牌上移事件
    addPokerTouch:function () {
        //添加事件
        for(var i=0; i<this.pokers.length; i++){
            var poker = this.pokers[i];
            poker.getComponent('Poker').addTouchEvent();
        }
    },
    //移除所有手牌注册的事件
    removePokerTouch:function () {
        for(var i=0; i<this.pokers.length; i++){
            var poker = this.pokers[i];
            poker.getComponent('Poker').removeAllEvent();
        }
    }
    
});
