//自己的座位(带有操控面板的)
var Seat = require("Seat");
var Util = require('Util');
var Http = require('Http');
var Router = require('Router');
cc.Class({
    extends: Seat,
    properties: {
        selectMultipleWin:{
            default:null,
            type:cc.Node
        },
        palyerMultipleWin:{
            default:null,
            type:cc.Node
        },
        resultPanel:{
            default:null,
            type:cc.Node
        },
        // playerMultiple:5, //5, 10, 15, 20, 25 闲家倍数
        count:0, //总数
    },

    // use this for initialization
    onLoad: function () {
        //建立事件,计算牌结果
        this.node.on('COUNT_POKER', function(event){
            var num = event.getUserData().msg;
            this.count += num;
            this.resultPanel.getComponent('ResultPanel').addPoker(num);
            //刷新显示
            event.stopPropagation();
        }, this); 

        var self = this;
        this.scoreHandler_ = Http.userData.addDataObserver('score', function(){            
            //积分变动
            if(self.scoreValue) {
                var score = this.score - self.scoreValue;
                var pt = self.scoreLabel.node.getPosition();
                pt.x = pt.x - 40;
                pt.y = pt.y + 20;
                var label = new cc.Node();
                label.addComponent(cc.Label);
                label.color = new cc.Color(255, 255, 0);
                label.getComponent(cc.Label).fontSize = 18;

                label.getComponent(cc.Label).string = (score > 0 ? "+" : "-") + Util.bigNumToStr(Math.abs(score));
                label.opacity = 0;
                label.parent = self.node;
               
                label.setPosition(pt);
                label.runAction(cc.sequence(cc.delayTime(2), cc.fadeIn(0.1), cc.delayTime(0.3), cc.moveBy(0.8, 0, 30), cc.fadeOut(0.2), cc.callFunc(function(){
                    this.removeFromParent();
                }, label)));   
            };
            self.scoreValue = this.score;
            self.scoreLabel.string = Util.bigNumToStr(this.score);     
        });
    },

    //拿到4张牌,设置可见
    getFourPoker:function (data) {
        //拿到的对象为(自己的手牌类对象)
        var handpoker = this.handSeat.getComponent('SelfHandPoker');
        handpoker.doDealFourPoker(data); //发4张牌
        handpoker.show();
    },
    //设置手牌可见
    showHandPoker:function(){
        this.handSeat.getComponent('SelfHandPoker').show();
    },

    //具有发4张牌动画的发牌
    doDealFourPoker_Ani:function(data, cb){
        this.handSeat.getComponent('SelfHandPoker').doDealFourPoker_Ani(data, cb);
    },

    //叫倍选择(阻塞)设置回调
    showMultipleWin:function (minBuyIn) {
        this.selectMultipleWin.active = true;
        var max = Math.floor(this.point/minBuyIn);
        console.log("玩家抢庄限制: " + Util.bigNumToStr(this.point) + ' / ' + Util.bigNumToStr(minBuyIn) + ' = ' + max);
        this.selectMultipleWin.getComponent('BtnsControl').show(max);
        this.node.on('SELECT_MULTIPLE', function(event){
            this.setMultiple(event.getUserData().msg);
            this.selectMultipleWin.active = false;
        }, this);
    },
      
    showPalyerMultipleWin:function (bankerPoint, blind, xs) {
        var max = Math.floor(Math.min(bankerPoint, this.point) / blind / xs);
        console.log("玩家叫倍限制: " + Util.bigNumToStr(bankerPoint) + ' / ' + Util.bigNumToStr(blind) + ' / ' + xs +' = ' + max);
        this.palyerMultipleWin.active = true;
        this.palyerMultipleWin.getComponent('BtnsControl').show(max);
        this.node.on('PLAYER_SELECT_MULTIPLE', function(event){
                this.palyerMultipleWin.active = false;
                this.playerMultiple = event.getUserData().msg;
        }, this);
    },
    
    showResultPanel:function () {
        this.resultPanel.active = true;
        this.handSeat.getComponent('HandPoker').addPokerTouch();
    },
    
    //拿到最后一张牌
    getLastPoker:function (onePoker) {
        Seat.prototype.getLastPoker.call(this, onePoker);
        this.handSeat.getComponent('HandPoker').show();
    },
    //关闭计算窗口
    closeResultPanel:function () {
        this.resultPanel.getComponent('ResultPanel').clearAll();
        this.resultPanel.active = false;
    },
    closeSelectMultipleWin:function () {
        this.selectMultipleWin.active = false;
    },
    closePalyerMultipleWin:function () {
        this.palyerMultipleWin.active = false;
    },
    updateSeat:function(){
        if(this.hold){ //有人
            if(this.noHoldPanel&&this.holdPanel){ //修改是否有人显示
                this.holdPanel.active = true;
                this.noHoldPanel.active = false;
            }
            //更新数据显示
            this.nameLabel.string = Util.formatName(this.nameStr, 6);
            
            this.pointLabel.string = Util.bigNumToStr(this.point);

            //叫庄更新
            if(this.multiple >= 0){
                this.multipleLabel.node.active = true;
                var key = 'fnt_bei' + this.multiple; 
                if(this.multiple == 0){ //协议调整 5 == 0
                    key = 'fnt_bei5';
                }
                this.multipleLabel.spriteFrame = this.spriteAtlas.getSpriteFrame(key);
            }else {
                this.multipleLabel.node.active = false;
            }
            
            //叫倍更新
            if(this.playerMultiple > 0){ //已经叫倍了
                this.playerMultipleLabel.node.active = true;
                var key = 'fnt_bei' + this.playerMultiple;
                if(this.playerMultiple == 5){ //协议调整 5 == 0
                    key = 'fnt_bei5_5';
                }
                this.playerMultipleLabel.spriteFrame = this.spriteAtlas.getSpriteFrame(key);
            }else {
                 this.playerMultipleLabel.node.active = false;
            }
            //庄家状态
            this.banker.node.active = this.isBanker;
        }else { //空座
            if(this.noHoldPanel&&this.holdPanel){
                this.noHoldPanel.active = true;
                this.holdPanel.active = false;
            }
        }
    },
    
    onDestroy: function(){
        Http.userData.removeDataObserver("score", this.scoreHandler_ );
    },
    updateChatNode:function(){

    },
    //添加消息
    addChatMsg:function(pack){
        var self = this;
        switch(pack.tid){ //类型:0表情 1文字
            case 0 : 
                cc.loader.loadRes("expression/expression_"+ pack.param, cc.SpriteAtlas, function (err, atlas) {
                    if(err)console.log(err);
                    else {
                        var ep = new cc.Node();
                        var frameAnimation = ep.addComponent('FrameAnimation');
                        frameAnimation.init(atlas, 'expression-' + pack.param + '-0001');
                        self.userInfoPabel.addChild(ep);
                        frameAnimation.autoAddFrame('expression-' + pack.param + '-000', 2);
                        frameAnimation.run(function(){
                            ep.removeFromParent();
                        });
                    }
                });
                break;
            case 1 : 
                var label = new cc.Node();
                label.addComponent(cc.Label);
                label.color = new cc.Color(255, 255, 0);
                label.getComponent(cc.Label).fontSize = 16;
                label.width = 100;
                label.getComponent(cc.Label).enableWrapText = true;
                label.getComponent(cc.Label).lineHeight = 17;
                label.getComponent(cc.Label).overflow = cc.Label.Overflow.RESIZE_HEIGHT;
                label.getComponent(cc.Label).TextAlignment = cc.TextAlignment.LEFT;
                label.getComponent(cc.Label).VerticalTextAlignment = cc.VerticalTextAlignment.TOP;
                label.getComponent(cc.Label).string = pack.content;
                if(this.chatNode){
                    this.chatNode.active = true; //显示聊天框
                    this.chatNode.getChildByName('layout').removeAllChildren();
                    this.chatNode.getChildByName('layout').addChild(label);
                    this.scheduleOnce(function(){ //下一帧立即执行
                        this.chatNode.getChildByName('Bg').height = label.height + 30;
                    }, 0);
                    this.chatNode.opacity = 255;
                    var opacityAni = cc.fadeTo(0.5, 0);
                    this.chatNode.runAction(cc.sequence(cc.delayTime(2), opacityAni));
                    //本地记录同时添加 
                    Router.chatWin.addChatRecord(this.getUserData(), pack.content);
                };
                break;
            default:
                break;
        }
    },

});
