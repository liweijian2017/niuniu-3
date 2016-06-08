var ImageLoader = require('ImageLoader');
var Util = require('Util');
var Router = require('Router');
/**
 * 基本座位类
 */
cc.Class({
    extends: cc.Component,
    properties: {
        posType:1,//0:左边座位; 1:右边座位
        id:-1, //座位id
        posId:0, //本地显示位置id
        hold:false,//false:空位; true:有人
        state:-1, //座位状态: -1:没人; 0:等待游戏开始 1:开始叫庄 2;如果是闲家(叫倍); 3:拿到最后一张牌(看牛); 4:看牛结束,飞金币
        multiple:-1,//-1:还没有开始抢;0:不抢; 0-4代表倍数,表示抢庄
        nameStr:'',
        score:0,
        point:0,
        playerMultiple:0,
        isBanker:false,//false:非庄;true:庄家
        userData:null, //坐在座位上的用户数据
        spriteAtlas:{
            default:null,
            type:cc.SpriteAtlas  
        },
        holdPanel:{ //有人显示
            default:null,
            type:cc.Node
        },
        noHoldPanel:{ //空座显示
            default:null,
            type:cc.Node
        },
        userInfoPabel:{ //用户头像积分等界面
            default:null,
            type:cc.Node
        },
        handSeat:{//手牌组件
            default:null,
            type:cc.Node
        },
        nameLabel:{ //名字组件
            default:null,
            type:cc.Label
        },
        scoreLabel:{ //积分组件
            default:null,
            type:cc.Label
        },
        pointLabel:{ //筹码组件
            default:null,
            type:cc.Label
        },
        headImg:{//头像组件
            default:null,
            type:cc.Sprite
        },
        multipleLabel:{//倍数组件
            default:null,
            type:cc.Sprite
        },
        playerMultipleLabel:{
            default:null,
            type:cc.Sprite
        },
        banker:{ //庄家组件
            default:null,
            type:cc.Sprite
        },
        sameBg:{
            default:null,
            type:cc.Sprite
        },
        stateLabel:{
            default:null,
            type:cc.Node
        },
        chatNode:{ //聊天组件
            default:null,
            type:cc.Node
        },
    },
    //初始化
    onLoad: function () {
    },
    start:function(){
        //渲染空位,设置空位数值
        this.updateSeat();
    },
    //更新座位显示
    updateSeat:function(){
        //类型更新
        if(this.hold){ //有人
            if(this.noHoldPanel&&this.holdPanel){ //修改是否有人显示
                this.holdPanel.active = true;
                this.noHoldPanel.active = false;
            }
            //更新数据显示
            this.nameLabel.string = Util.formatName(this.nameStr, 6);
            this.scoreLabel.string = Util.bigNumToStr(this.score);
            this.pointLabel.string = Util.bigNumToStr(this.point);

            //叫庄更新
            if(this.multiple >= 0){
                this.sameBg.node.active = true;
                this.multipleLabel.node.active = true;
                var key = 'fnt_bei' + this.multiple; 
                if(this.multiple == 0){ //协议调整 5 == 0
                    key = 'fnt_bei5';
                }
                this.multipleLabel.spriteFrame = this.spriteAtlas.getSpriteFrame(key);
            }else {
                this.multipleLabel.node.active = false;
                this.sameBg.node.active = false;
            }
            //叫倍更新
            if(this.playerMultiple > 0){ //已经叫倍了
                this.playerMultipleLabel.node.active = true;
                this.sameBg.node.active = true;
                var key = 'fnt_bei' + this.playerMultiple;
                if(this.playerMultiple == 5){ //协议调整 5 == 0
                    key = 'fnt_bei5_5';
                }
                this.playerMultipleLabel.spriteFrame = this.spriteAtlas.getSpriteFrame(key);
            }else {
                 this.playerMultipleLabel.node.active = false;
                 this.sameBg.node.active = false;
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
    //更新位置显示
    updatePosType:function () {
        if(this.posType == 0){ //左边
            this.userInfoPabel.setPosition(cc.p(-55,0));
            this.handSeat.setPosition(cc.p(-20, -15));
            this.noHoldPanel.setPosition(cc.p(-55,0));
            this.stateLabel.setPosition(cc.p(85,27));
        }else { //右边
            this.userInfoPabel.setPosition(cc.p(55,0));
            this.handSeat.setPosition(cc.p(-80, -15));
            this.noHoldPanel.setPosition(cc.p(55,0));
            this.stateLabel.setPosition(cc.p(-85,27));
        }
    },
    
    //更新头像
    updataHeadImg:function (url) {
        //头像更新
        var self = this;
        var url = ImageLoader.load(url, function(ret, node){
            if(ret && self.headImg) {
                self.headImg.getComponent(cc.Sprite).spriteFrame = node.getComponent(cc.Sprite).spriteFrame;  
            }                   
        });
    },
    
    //坐庄
    toBeBanker:function () {
        this.isBanker = true;
        // this.setMultiple(-1);
        this.updateSeat();
    },
    
    //下庄
    toAwayBanker:function () {
        this.isBanker = false;
        this.updateSeat();
    },
    
    //设置用户数据（头像，姓名，积分，筹码）
    setUserData:function (userData) {
        if(!this.hold){ //目前是空座
            this.hold = true;
            this.nameStr = userData.name;
            this.score = userData.score;
            this.point = userData.point;
            //TODO 更新头像
            if(userData.imgUrl){
                this.updataHeadImg(userData.imgUrl);
            }
            this.updateSeat();
            this.userData = userData;
        }
    },
    
    //清空用户数据;清空座位
    removeUserData:function () {
        this.hold = false;// 设置离开状态
        this.state = -1;
        this.name = '空座';
        this.score = 0;
        this.point = 0;
        this.updateSeat();
        this.userData = null;
        this.handSeat.getComponent('HandPoker').removePokers(); //移除所有手牌
        this.scoreValue = null;
    },
    
    clearUserData:function(){
        this.id = -2; //表示被自己坐下的位置id
        this.hold = false;// 设置离开状态
        this.state = -1;
        this.name = '空座';
        this.score = 0;
        this.point = 0;
        this.updateSeat();
        this.userData = null;
        this.handSeat.getComponent('HandPoker').removePokers(); //移除所有手牌
        this.scoreValue = null;
        //移除所有动作
        // cc.director.getActionManager().removeAllActionsFromTarget(this.node);
        if(this.node.getChildByTag(1000))this.node.removeChildByTag(1000);
    },

    //设置请求坐庄状态(叫庄)
    setMultiple:function (multiple) {
        this.multiple = multiple;//设置叫庄状态
        this.updateSeat();
    },
    
    //设置请求坐庄状态(叫庄)
    setPlayerMultiple:function (multiple) {
        this.playerMultiple = multiple;//设置叫庄状态
        this.updateSeat();
    },

    closePlayerMultiple:function () {
        this.playerMultiple = 0;
        this.updateSeat();
    }, 
    /**
     * 发牌
     * data:接受到的数据
     */
    dealPokers:function(data){
        if(this.hold){
            if(this.handSeat.activeInHierarchy){
                this.handSeat.getComponent('HandPoker').setPokers(data);
            }
        }
    },
    //拿到4张牌(其他人的座位假处理)
    getFourPoker:function (data) {
        var data = [0x0102,0x0103,0x0104,0x0105];
        this.handSeat.getComponent('HandPoker').doDealFourPoker(data);
    },
    //具有发4张牌动画的发牌
    doDealFourPoker_Ani:function(data, cb){
        this.handSeat.getComponent('HandPoker').doDealFourPoker_Ani(data, cb);
    },
    //发牌4张
    doDealFourPoker:function(data){

    },
    //拿到5张牌(其他人的座位假处理)
    getFivePoker:function (data) {
        var data = [0x0102,0x0103,0x0104,0x0105,0x0106];
        this.handSeat.getComponent('HandPoker').doDealFourPoker(data);
    },
    //开牌
    showPokers:function (result) {
        if(this.hold){
            if(this.handSeat){
                this.handSeat.getComponent('HandPoker').show(result);
            }
        }
    },
    //拿到最后一张牌
    getLastPoker:function (onePoker) {
        this.handSeat.getComponent('HandPoker').addPoker(onePoker);
    },
    //点击发送自己的座位
    clickEvent:function () {
        var event =  new cc.Event.EventCustom('SELECT_SEAT', true);
        event.setUserData({msg:this.posId});
        this.node.dispatchEvent(event);
    },
    
    removePokers:function () {
        this.handSeat.getComponent('HandPoker').removePokers();
    },
    
    updataHandPoker:function (data) {
        this.handSeat.getComponent('HandPoker').updataPoker(data);
    },  
    getPos:function () {
        var pos = this.userInfoPabel.getPosition();
        var pos1 = this.userInfoPabel.parent.convertToWorldSpaceAR(pos);
        var pos2 = this.node.parent.convertToNodeSpaceAR(pos1);
        return pos2;
    },
    //改变 point
    countScore:function (point) {
        if(this.state < 0) return;
        var self = this;
        this.point += point;
        //出现动画   
        var label = new cc.Node();
        label.addComponent(cc.Label);
        label.color = new cc.Color(255, 255, 0);
        label.getComponent(cc.Label).fontSize = 18;

        label.getComponent(cc.Label).string = (point > 0 ? "+" : "-") + Util.bigNumToStr(Math.abs(point));
        label.opacity = 0;
        // label.parent = this.node;
        this.node.addChild(label, 1000, 1000);
        var pt = this.pointLabel.node.getPosition();
        pt.x = pt.x + 40;
        pt.y = pt.y + 20;
        label.setPosition(pt);
        label.runAction(cc.sequence(cc.delayTime(2), cc.fadeIn(0.1), cc.delayTime(0.3), cc.moveBy(0.8, 0, 30), cc.fadeOut(0.2), cc.callFunc(function(){
            this.removeFromParent();
        }, label)));
    },
    //设置分数
    setScore:function (score) {
        this.point = score;
    },
    //移除自己
    removeFromParent:function () {
        this.node.removeFromParent();
    },
    //设置桌子对象
    setTable:function (table) {
        this.handSeat.getComponent('HandPoker').setTable(table);
    },
    //看牌完成
    doFinish:function(){
        this.handSeat.getComponent('HandPoker').doFinish();
    },
    //取消完成状态
    annulFinish:function(){
        this.handSeat.getComponent('HandPoker').annulFinish();
    },
    //获取用户的Uid
    getUserUid:function(){
        var uid = null;
        if(this.hold){
            uid = this.userData.uid;
        }
        return uid;
    },
    //获取用户的钱
    getUserPoint:function(){
        var point = null;
        if(this.hold){
            point = this.userData.point;
        }
        return point;
    },
    //获取到用户的基本信息
    getUserData:function(){
        var user = null;
        if(this.hold) {
            user = {
                name:this.userData.name,
                headImg:this.headImg.spriteFrame
            }
        }
        return user;
    },
    //解析聊天包
    parseChatPack:function(pack){
        if(pack.uid != this.getUserUid())return;
        this.updateChatNode();
        this.addChatMsg(pack);
    },
    //更新聊天组件位置
    updateChatNode:function(){
        if(!this.chatNode)return;
        switch(this.posType) {
            case 0: //左边
                this.chatNode.setPosition(cc.p(97, 0));
                this.chatNode.getChildByName('Bg').rotation = -90;
                break;
            case 1: //右边
                this.chatNode.setPosition(cc.p(-97, 0));
                this.chatNode.getChildByName('Bg').rotation = 90;
                break;
        };
    },
    //显示聊天信息
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
                        this.chatNode.getChildByName('Bg').width = label.height + 10;
                    }, 0)
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
