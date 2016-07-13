var Util = require('Util');
cc.Class({
    extends: cc.Component,
    properties: {
        titles: {
            default: [],
            type: cc.Node
        },
        meIcon: {
            default: null,
            type: cc.Sprite
        },
        meProperty: {
            default: null,
            type: cc.Label
        },
        playerLayout:{
            default: null,
            type: cc.Node
        },
        itemPrefab:{
            default: null,
            type: cc.Prefab
        }
    },
    onLoad: function () {
        this.disabledUnderTouch();
    },
    start: function () {
    },
    
    setSelf:function () {
        
    },
    
    //设置类型,1:win 2:lose
    setTitle: function (result) {
        if(result === 0){
            this.titles[0].active = true; //WinTitle
            this.titles[1].active = false; //LoseTitle
            this.titles[2].active = false; //DrawTitle
        }else if(result === 1){
            this.titles[0].active = false; //WinTitle
            this.titles[1].active = true; //LoseTitle
            this.titles[2].active = false; //DrawTitle
        }else if(result === 2){
            this.titles[0].active = false; //WinTitle
            this.titles[1].active = false; //LoseTitle
            this.titles[2].active = true; //DrawTitle
        }
    },
    setProperty: function (propertyLabel, property) {
        if(property > 0){
            propertyLabel.node.color = new cc.Color(255, 255, 0);
            propertyLabel.string = '+' + property;
        }else{
            propertyLabel.node.color = new cc.Color(255, 0, 0);
            propertyLabel.string = property + '';
        }
    }, 
    //设置数据
    init: function (type, overPlayers, selfSeat) {
        var selfChange = 0;
        for(var i=0; i<overPlayers.length; i++){
            if(overPlayers[i].player.id == selfSeat.getComponent("SelfSeat").id){
                selfChange = overPlayers[i].change;
                break;
            }
            var item = cc.instantiate(this.itemPrefab);
            var data = { //数据
                name:overPlayers[i].player.nameStr,
                change:overPlayers[i].change,
                img:overPlayers[i].player.headImg.getComponent(cc.Sprite).spriteFrame,
            };
            item.getComponent('UserComponent').pointType = 1;
            item.getComponent('UserComponent').setUserData(data.name, data.change, data.img);
            this.addItem(item);
        };
        
        if(selfChange > 0){
            this.setTitle(0);
            cc.audioEngine.playEffect(cc.url.raw('resources/sound/game_win.mp3'));
        }else if(selfChange < 0){
            this.setTitle(1);
            cc.audioEngine.playEffect(cc.url.raw('resources/sound/game_lose.mp3')); 
        }
        if(selfSeat){
            if(this.meIcon) {
                this.meIcon.getComponent(cc.Sprite).spriteFrame = selfSeat.getComponent("SelfSeat").headImg.getComponent(cc.Sprite).spriteFrame;    
                this.meProperty.string = selfChange >= 0 ? ('+'+Util.bigNumToStr2(selfChange)) : Util.bigNumToStr2(selfChange);
            }
        }
    },
    //该Box出现时，阻止其之外的所有组件接收点击事件
    disabledUnderTouch: function () {
        this.node.on('mousedown', function (event) {
          event.stopPropagation();
        }, this);
        this.node.on('touchstart', function (event) {
          event.stopPropagation();
        }, this);
    },
    addItem:function (node) {
        var layout = this.playerLayout;
        layout.addChild(node);
    },
    removeAllItem:function () {
        if(this.playerLayout){
            this.playerLayout.removeAllChildren(); 
        }
    },
    //显示
    show:function (time, cb) {
        this.node.emit('fade-in');
        var self = this;
        setTimeout(function () {
            self.hide();
            if(cb)cb();
        }, time*1000);
    },
    //隐藏
    hide:function () {
        if(this.node){
            this.node.emit('fade-out');
        }
        this.removeAllItem();
    }
});
