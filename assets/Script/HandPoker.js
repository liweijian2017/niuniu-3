/**
 * 玩家手上的牌
 */
var Poker = require('Poker');
cc.Class({
    extends: cc.Component,

    properties: {
        isFinish:false, //是否已经选牛完成
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
        },
        result2:{ //结果显示
            default:null,
            type:cc.Sprite
        },
        three:{ //好牌显示
            default:null,
            type:cc.Sprite
        },
        table:{
            default:null,
            type:cc.Node//牌桌对象
        },
        finishLabel:{ //选牛完成显示组件
            default:null,
            type:cc.Sprite
        },
    },
    onLoad: function () {

    },
    setTable:function (table) {
        this.table = table;
    },
    getTableForNodePos:function () {
        //1.拿到自己对于table的中点的位置
        var pos = this.table.parent.convertToWorldSpaceAR(cc.v2(0, 0)); //世界坐标
        //2.换算成本节点的位置
        var pos2 = this.node.parent.convertToNodeSpaceAR(pos); //自己坐标
        return cc.p(pos2.x - this.node.getPositionX(), pos2.y);
    },
    //发牌给玩家
    setPokers:function (pokersData) {
        for(var i=0; i<pokersData.length; i++){
            var poker = cc.instantiate(this.pokerPrefab);
            poker.getComponent('Poker').init(pokersData[i]);
            this.pokers.push(poker);
            this.node.addChild(poker);
            poker.getComponent('Poker').scale = 0.3;
            //3.设置位置初始位置
            poker.getComponent('Poker').node.setPosition(this.getTableForNodePos());
            poker.getComponent('Poker').updateSprites();
            //4.进行移动动画
            var ani = cc.spawn(cc.moveTo(0.3, cc.p(23+i*15, 0)), cc.scaleTo(0.3, 0.7), cc.callFunc(function(){
                cc.audioEngine.playEffect(cc.url.raw('resources/sound/game_deal_card.mp3'));
            }, this));
            poker.getComponent('Poker').node.runAction(cc.sequence(cc.delayTime(0.25*i), ani));
        };
    },
    doDealFourPoker:function(pokersData){
        for(var i=0; i<pokersData.length; i++){
            var poker = cc.instantiate(this.pokerPrefab);
            poker.getComponent('Poker').init(pokersData[i]);
            poker.getComponent('Poker').scale = 0.7;
            this.pokers.push(poker);
            this.node.addChild(poker);
        };
        this.updatePokers(); //更新位置显示
    },

    //发四张牌带有动画的
    doDealFourPoker_Ani:function(pokersData, cb){
        var count = 0; //计算发牌的数量
        for(var i=0; i<pokersData.length; i++){
            var poker = cc.instantiate(this.pokerPrefab);
            poker.getComponent('Poker').init(pokersData[i]);
            this.pokers.push(poker);
            this.node.addChild(poker);
            poker.getComponent('Poker').scale = 0.3;
            //3.设置位置初始位置
            poker.getComponent('Poker').node.setPosition(this.getTableForNodePos());
            poker.getComponent('Poker').updateSprites();
            //4.进行移动动画
            var ani = cc.spawn(cc.moveTo(0.3, cc.p(23+i*15, 0)), cc.scaleTo(0.3, 0.7), cc.callFunc(function(){
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
    //更新手牌数据
    updataPoker:function (pokersData) {
        if(!pokersData)return;
        for(var i=0; i<pokersData.length; i++){
            var poker = cc.instantiate(this.pokerPrefab);
            if(this.pokers[i]){
                this.pokers[i].getComponent('Poker').scale = 0.7;
                this.pokers[i].getComponent('Poker').init(pokersData[i]);
            }
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
        if(key !== '' && spriteFrame) {
            this.result2.node.active = true;
            this.result2.node.zIndex = this.node.childrenCount + 11;
            this.three.spriteFrame = spriteFrame;
        }
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
            this.result2.node.active = false;
        }
    },
    //添加一张牌
    addPoker:function (onePoker) {
        var poker = cc.instantiate(this.pokerPrefab);
        poker.getComponent('Poker').init(onePoker);
        poker.getComponent('Poker').node.setPosition(this.getTableForNodePos());
        var endPos = cc.p(23+4*15, 0);
        this.pokers.push(poker);
        this.node.addChild(poker, 5);
        poker.getComponent('Poker').scale = 0.7;
        poker.getComponent('Poker').updateSprites();
        poker.getComponent('Poker').node.runAction(cc.moveTo(0.8, endPos));
    },
    //转到完成状态
    doFinish:function(){
        if(this.finishLabel){
            this.finishLabel.node.active = true;
            this.finishLabel.node.zIndex = this.node.childrenCount + 12;
            this.isFinish = true;
        }
    },
    //取消完成状态
    annulFinish:function(){
        if(this.finishLabel){
            this.isFinish = false;
            this.finishLabel.node.active = false;
        }
    }

});
