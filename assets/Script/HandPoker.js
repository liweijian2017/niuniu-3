/**
 * 玩家手上的牌
 */
var Poker = require('Poker');
cc.Class({
    extends: cc.Component,

    properties: {
        spriteAtlas:{
            default:null,
            type:cc.SpriteAtlas  
        },
        pokers:{
            default:[],
            type:[Poker]
        },
        pokerPrefab:cc.Prefab, //牌模板
        result:{ //结果显示
            default:null,
            type:cc.Sprite
        },
        one:{
            default:null,
            type:cc.Sprite
        },
        two:{
            default:null,
            type:cc.Sprite
        }
    },
    onLoad: function () {
        
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
    
    updataPoker:function (pokersData) {
        for(var i=0; i<pokersData.length; i++){
            var poker = cc.instantiate(this.pokerPrefab);
            this.pokers[i].getComponent('Poker').init(pokersData[i]);
        }
    },
    
    //更新显示(调整位置)
    updatePokers:function () {
        var padding = 18;
        for(var i=0; i<this.pokers.length; i++){
            var poker = this.pokers[i];
            poker.getComponent('Poker').node.setPositionX(23+i*15);
        }
    },
    //开牌(把全部牌都翻过来即可)
    show:function (result) {
        for(var i=0; i<this.pokers.length; i++){
            var poker = this.pokers[i];
            poker.getComponent('Poker').setState(true);
        }
        //处理显示结果
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
    //丢掉所有手牌
    removePokers:function () {
        for(var i=0; i<this.pokers.length; i++){
            var poker = this.pokers[i];
            poker.removeFromParent();
        }
        this.pokers = [];
        if(this.result){
            this.result.node.active = false;
        }
    },
    //添加一张牌
    addPoker:function (onePoker) {
        var poker = cc.instantiate(this.pokerPrefab);
        poker.getComponent('Poker').init(onePoker);
        this.pokers.push(poker);
        this.node.addChild(poker);
        this.updatePokers();
    }
});
