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
            //3.设置位置(计算偏移值)
            poker.getComponent('Poker').node.setPosition(this.getTableForNodePos());
            poker.getComponent('Poker').node.setScale(0.3);
            poker.getComponent('Poker').updateSprites();
            //4.进行移动动画
            var ani = cc.spawn(cc.moveTo(0.3, cc.p(i*poker.getComponent('Poker').node.width, 0)), cc.scaleTo(0.3, 1), cc.callFunc(function(){
                cc.audioEngine.playEffect(cc.url.raw('resources/sound/game_deal_card.mp3'));
            }, this));
            poker.getComponent('Poker').node.runAction(cc.sequence(cc.delayTime(0.25*i), ani));
        }
    },

    //发四张牌带有动画的
    doDealFourPoker_Ani:function(pokersData, cb){
        var count = 0; //计算发牌的数量
        for(var i=0; i<pokersData.length; i++){
            var poker = cc.instantiate(this.pokerPrefab);
            poker.getComponent('Poker').init(pokersData[i]);
            this.pokers.push(poker);
            this.node.addChild(poker);
            //3.设置位置初始位置
            poker.getComponent('Poker').node.setPosition(this.getTableForNodePos());
            poker.getComponent('Poker').node.setScale(0.3);
            poker.getComponent('Poker').updateSprites();
            //4.进行移动动画
            var ani = cc.spawn(cc.moveTo(0.3, cc.p(i*poker.getComponent('Poker').node.width, 0)), cc.scaleTo(0.3, 1), cc.callFunc(function(){
                cc.audioEngine.playEffect(cc.url.raw('resources/sound/game_deal_card.mp3'));
            }, this));
            var endFun = cc.callFunc(function(){
                //结束
                ++count;
                if(count == 4){
                    if(cb())return;
                }
            },this);
            poker.getComponent('Poker').node.runAction(cc.sequence(cc.delayTime(0.25*i), ani, endFun));
        };
    },


    doDealFourPoker:function(pokersData){
        for(var i=0; i<pokersData.length; i++){
            var poker = cc.instantiate(this.pokerPrefab);
            poker.getComponent('Poker').init(pokersData[i]);
            poker.getComponent('Poker').node.setPosition(cc.p(i*poker.getComponent('Poker').node.width, 0));
            this.pokers.push(poker);
            this.node.addChild(poker);
        };
    },

    show:function (data) {
        for(var i=0; i<this.pokers.length; i++){
            var poker = this.pokers[i];
            poker.getComponent('Poker').setState(true);
        }
        //处理显示结果
        this.result.node.active = true;
        this.result.node.zIndex = this.node.childrenCount + 10;
        var key1 = "fnt_mei";
        var key2 = "fnt_niu2";
        if(data === 0) { //没牛
            key1 = "fnt_mei";
            key2 = "fnt_niu2";
        }else if(data === 10) { //牛牛
            key1 = "fnt_niu";
            key2 = "fnt_niu";
        }else if(data>0 && data<10){ //普通牛
            key1 = "fnt_niu2";
            key2 = "fnt_"+data;
        }else {
            this.result.node.active = false;
        }
        this.one.spriteFrame = this.spriteAtlas.getSpriteFrame(key1);
        this.two.spriteFrame = this.spriteAtlas.getSpriteFrame(key2);

        var key = '';
        if(data == 11){ //顺
            key = "fnt_niu_shunzi";
        }else if(data == 12){ //三带一对
            key = "fnt_niu_sandai";
        }else if(data == 13){ //全小
            key = "fnt_niu_xiao";
        }else if(data == 14){ //全大
            key = "fnt_niu_quanda";
        }else if(data == 15){ //炸弹
            key = "fnt_niu_zhadan";
        }else {
            this.result2.node.active = false;
        }
        var spriteFrame = this.spriteAtlas.getSpriteFrame(key);
        if(key != '' && spriteFrame) {
            this.result2.node.active = true;
            this.result2.node.zIndex = this.node.childrenCount + 11;
            this.three.spriteFrame = spriteFrame;
        }
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
    },
    //添加一张牌
    addPoker:function (onePoker) {
        var poker = cc.instantiate(this.pokerPrefab);
        poker.getComponent('Poker').init(onePoker);
        poker.getComponent('Poker').node.setPosition(this.getTableForNodePos());
        this.pokers.push(poker);
        this.node.addChild(poker);
        var endPos = cc.p(4*poker.width, 0);
        poker.getComponent('Poker').node.runAction(cc.moveTo(0.8, endPos));
    },

    updataPoker:function (pokersData) {
    if(!pokersData)return;
    for(var i=0; i<pokersData.length; i++){
        var poker = cc.instantiate(this.pokerPrefab);
        if(this.pokers[i]){
            this.pokers[i].getComponent('Poker').init(pokersData[i]);
        }
    }
    },

});
