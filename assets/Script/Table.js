var Game = require('Game');
var GameData = require('GameData');
var Http = require('Http');
var P = require('GAME_SOCKET_PROTOCOL');
var SchedulerPool = require('SchedulerPool');
var sp = new SchedulerPool();
var Router = require('Router');
var BroadcastReceiver = require('BroadcastReceiver'); //广播接收器
var Util = require('Util');
var SelfSeat = require('SelfSeat'); //自定义组件类型

cc.Class({
    extends: cc.Component,
    properties: {
        posList:{ //位置列表
            default:[],
            type:[cc.Node]
        },
        seatPrefab:{ //座位节点的容器
            default:null,
            type:cc.Prefab
        },
        seats:{ //所有座位
            default:[],
            type:[cc.Node]
        },
        startHint:{ //开始提示
            default:null,
            type:cc.Node
        },
        selfSeat:{//操作面板, 包含了自己的座位状态
            default:null,
            type:SelfSeat
        },
        endPanel:{//结束弹框
            default:null,
            type:cc.Node
        },
        roomName:{
            default:null,
            type:cc.Label
        },
        hint:{ //提示
            default:null,
            type: cc.Prefab
        },
        expressionWin:{ //表情框
            default:null,
            type:cc.Node
        },
        chatWin:{ //聊天框
            default:null,
            type:cc.Node
        },
        isSit:false, //用户自己是否已经坐下
        gameStatus:0, //房间状态
        finalPokerType:0, //最终牌型
        minBuyIn:0, //入场筹码需求数量
        blind:0, //盲注
        xs:3,
    },

    onLoad: function () {
        Router.tabel = this;
        GameData.IN_GAME = 1;
        this.initSeats();
        this.playerList = null;
        this.selectedSeat = null; //被选择中的座位(打牌的时候隐藏,玩家离开座位显示)
        this.oldHint = null; //存储当前的提示,下一个提示出现时候方便移除该提示
        this.bankerSeat = null; //当前局庄家是谁

        //监听用户的倍数选择
        this.node.on('SELECT_MULTIPLE', function(event){
            var index = event.getUserData().msg;
            this.selfSeat.setMultiple(index);
            event.stopPropagation();
            Game.socket.sendDo(index);
        }, this);

        //监听闲家选择倍数
        this.node.on('PLAYER_SELECT_MULTIPLE', function(event){
            var index = event.getUserData().msg;
            event.stopPropagation();
            this.selfSeat.setPlayerMultiple(index);
            Game.socket.sendDo(index);
        }, this);

        //开牌结果处理
        this.node.on('COUNT_HANDLEPOKER', function(event){
            var index = event.getUserData().msg;
            if(0 == index){ //点击有牛
                this.selfSeat.showPokers(this.finalPokerType);
                this.selfSeat.closeResultPanel();
                Game.socket.sendDo(1);
            }else { //点击没牛
                if(this.finalPokerType == 0){ //确实没牛
                    this.selfSeat.showPokers(this.finalPokerType);
                    this.selfSeat.closeResultPanel();
                    Game.socket.sendDo(0);
                }else {//给出提示
                    this.popupToast(null, 3, '请再看看手牌!', true);
                }
            }
            event.stopPropagation();
        }, this);

        //玩家选择座位,处理
        this.node.on('SELECT_SEAT', function(event){
            if(this.isSit)return;
            var index = event.getUserData().msg;
            Game.socket.sendSitDown(parseInt(index));
            var canvas = cc.director.getScene().getChildByName('Canvas');
            canvas.getComponent('PopUp').showLoadding("正在坐下");
        }, this);

    },

    init:function(pack){
        this.roomName.string = pack.roomName + " 底分:" + Util.bigNumToStr2(pack.blind); //底分提示
        this.minBuyIn = pack.minBuyIn; //最小携带
        this.blind = pack.blind; //盲注
        this.xs = pack.xs;
        this.gameStatus = pack.gameStatus;
        this.playerList = pack.playerList;
        this.makeBanker(pack.dealerSeatId);
    },
    //确定出庄家
    makeBanker:function(dealerSeatId){
        if(dealerSeatId <= -1)return;
        this.handleAllSeats(function(seat){
            if(seat.id == dealerSeatId){
                this.bankerSeat = seat;
                seat.toBeBanker();
                if(seat.multiple == 0||seat.multiple == -1){
                    seat.setMultiple(1);
                }else {
                    seat.setMultiple(seat.multiple);
                }
            }else {
                seat.setMultiple(-1);
            }
        }.bind(this));
    },

    //初始化所有座位,根据所有的位置
    initSeats:function () {
        for(var k=0; k<this.posList.length; k++){
            var pos = this.posList[k].getPosition();
            var seat = cc.instantiate(this.seatPrefab);
            this.seats.push(seat);
            this.node.addChild(seat);
            seat.setPosition(pos);
            var seatComponent = seat.getComponent('Seat');
            if(k==0||k==1||k==4){ //左边座位
                seatComponent.posType = 0;
            }else {
                seatComponent.posType = 1;
            }
            seatComponent.id = k;  //座位ID
            seatComponent.posId = k; //座位位置ID
            seatComponent.updatePosType();
            seatComponent.setTable(this.node);
        }
    },
    //游戏开始入口
    start:function () {
    },
    //离开桌面,移除监听
    onDestroy:function () {
    },

    doLeaveRoom:function(){      
        Game.socket.sendLeaveRoom();
        var canvas = cc.director.getScene().getChildByName('Canvas');
        canvas.getComponent('PopUp').showLoadding("正在离开");
        cc.director.loadScene('MainScene');
    },

    //回到首页
    leaveRoom:function () {
        // console.log("目前自己的座位状态:" + this.selfSeat.state);
        if(this.selfSeat.state == 0 || this.selfSeat.state == -1){
            this.isSelfLeave = true;  //主动离开
            this.doLeaveRoom();
            return;
        }
        if(this.gameStatus == 100 || this.gameStatus == 0){
            this.isSelfLeave = true;
            this.doLeaveRoom();
            return;
        }
        var canvas = cc.director.getScene().getChildByName('Canvas');
        canvas.getComponent('PopUp').showDlg('正在打牌中,不能逃跑'); 
    },
    //获取桌子中心位置
    getTabelCenter:function () {
        var pos = this.node.parent.convertToWorldSpace(cc.v2(0, 0));
        return pos;
    },

    //选择位置坐下 index : 点击的座位号; playerList:其他人的信息
    selectSeatDowm:function (index, playerList) {
        if(this.isSit)return;
        this.isSit = true;
        //设置其他座位数据
        this.seatImportData(playerList);
        //设置面板数据
        this.setSelfSeatData(index);
    },

    //设置用户面板数据
    setSelfSeatData:function (id, state, seatChips) {
        var userData = {
            name:Http.userData.name,
            score:Http.userData.score,
            point: seatChips, //筹码数量由网络确定
            imgUrl:Http.userData.image,
            uid:Http.userData.uid
        }
        this.isSit = true;
        this.selfSeat.node.active = true;
        this.selfSeat.setUserData(userData);
        this.selfSeat.id = id;
        this.selfSeat.closePlayerMultiple();
        this.selfSeat.state = state||0; //默认为0   
    },
    //关闭面板
    clearSelfSeat:function(){
        this.isSit = false;
        this.selfSeat.clearUserData();
        this.selfSeat.node.active = false;
    },
    //加载用户数据到座位上面
    seatImportData:function (playerList) {
        for(var j=0; j<this.seats.length; j++){ //遍历座位
            var seat = this.seats[j].getComponent("Seat");
            for(var i=0; i<playerList.length; i++){  //遍历用户
                var data = {  //拿到用户数据
                    name:playerList[i].nick,
                    score:playerList[i].point,
                    point:playerList[i].seatChips,
                    imgUrl:playerList[i].img,
                    uid:playerList[i].uid,
                }
                //在对应的位置上面设置数据
                if(seat.id == this.playerList[i].seatId){
                    seat.setUserData(data);                 //设置数据
                    seat.state = this.playerList[i].state; //记录座位状态
                }
            }
        }
    },
    //更改所有座位的状态
    setStateForSeats:function (stateNum) {
        this.handleAllSeats(function (seat) {
            if(seat.hold){ //只修改所有的已经坐下有人的座位状态
                seat.state = stateNum;
            }
        });
    },
    //座位状态进入下一步
    stateToNext:function () {
        this.handleOtherSeat(function (seat) {
            if(seat.hold && seat.state > 0){
                seat.state = (seat.state + 1) % 5;
            }
        });
        if(this.selfSeat.state > 0){
            this.selfSeat.state = (this.selfSeat.state + 1) % 5;
        }
    },
    //移动座位位置id, 用户座位为4; index:用户选择的位置id
    moveAllPosId:function (index) {
        //移动seatNode的位置
        var offX = 4 - index;
        for(var k=0; k<this.seats.length; k++){
            //设置位置
            var i = (k + offX + 5) % 5;
            var pos = this.posList[i].getPosition();
            if(i==0||i==1||i==4){ //左边座位
                this.seats[k].getComponent('Seat').posType = 0;
            }else {
                this.seats[k].getComponent('Seat').posType = 1;
            }
            this.seats[k].setPosition(pos);
        }
        //调整左右显示
        this.handleOtherSeat(function (seat) {
            seat.updatePosType();
        });
    },
    //处理所有的座位
    handleAllSeats:function (cb) {
        if(!this.seats)return;
        for(var i=0; i<this.seats.length; i++){
            cb(this.seats[i].getComponent("Seat"));
        }
        if(this.isSit){
            cb(this.selfSeat);
        }
    },
    //处理除自己以为的座位
    handleOtherSeat:function (cb) {
        for(var i=0; i<this.seats.length; i++){
            if(cb(this.seats[i].getComponent("Seat"))){ //return true;
                return;
            }
        }
    },
    //清除庄家
    clearBanker:function () {
        this.handleAllSeats(function (seat) {
            seat.toAwayBanker()
        });
        if(this.bankerSeat) {
            this.bankerSeat.setMultiple(-1);
            this.bankerSeat.toAwayBanker();
        }
        this.bankerSeat = null;
    },
    //执行金币动画
    startGoldAni:function (pack, cb) {
        var winer = [];
        var loser = [];
        var self = this;
        for(var j=0; j<pack.seatChangeList.length; j++){
            var change = pack.seatChangeList[j];
            this.handleAllSeats(function (seat) {
                //1.所有除庄家以外的
                if(!seat)return;
                if(seat.id != self.bankerSeat.id){
                    if(seat.id == change.seatId){
                        if(change.seatChips < 0){
                            loser.push(seat);
                        }else {
                            winer.push(seat);
                        };
                    }
                }
                if(seat.id == change.seatId){
                    seat.countScore(change.seatChips);
                    seat.updateSeat();
                }
            });
        };
        var endPos = cc.p(0, 0);
        if(self.bankerSeat){
            endPos = self.bankerSeat.getPos();
        }
        //收金币
        for(var k=0; k<loser.length; k++) { //动画
            if(loser[k].getPos){
                self.getComponent('Animation_0').runAni(loser[k].getPos(), endPos, function () {
                    if(winer.length == 0 && cb){ //没有出金币的动画
                        cb();
                    }
                });
            }
        };
        //出金币
        this.scheduleOnce(function() {
            for(var kk=0; kk<winer.length; kk++) {
                if(winer[kk].getPos){
                    this.getComponent('Animation_0').runAni(endPos, winer[kk].getPos(), function () {
                            if(cb)cb();
                    });
                }
            }
        }, 1);
    },
    //显示提示(位置;持续时间;内容;是否显示倒计时,false:显示,true:不显示;回调函数)
    popupToast:function(pos, time, text, flag, cb){
        if(this.oldHint) { //存在先移除
            this.oldHint.removeFromParent();
        }
        var _toast = cc.instantiate(this.hint); //创建一个倒计时toast
        this.oldHint = _toast; //记录
        _toast.getComponent('CountToast').setStartPos(pos||cc.p(0, -30)); //设置位置
        _toast.getComponent('CountToast').setContent(text);
        this.node.addChild(_toast);
        _toast.getComponent('CountToast').show(time, flag||false, function(){
            if(cb)cb();
            _toast.removeFromParent(); //移除自己
        });
    },
    //打开表情框
    openExpressionWin:function(){
        this.expressionWin.active = true;
        this.expressionWin.setPosition(cc.p(0, 0)); 
    },
    //关闭表情框
    closeExpressionWin:function(){
        this.expressionWin.setPosition(cc.p(3000, 0)); 
        this.expressionWin.active = false;
    },
    //打开聊天框
    openChatWin:function(){
        this.chatWin.active = true;
        this.chatWin.setPosition(cc.p(0, 0));
        this.chatWin.getComponent('ChatWin').scrollToBottom();
    },
    //关闭聊天框
    closeChatWin:function(){
        this.chatWin.setPosition(cc.p(3000, 0)); 
        this.chatWin.active = false;
    },
    //提示台费和积分规则
    showTabelInfo:function(venue, blind, roomScore){
        var size = cc.director.getWinSizeInPixels();
        var taifei = Math.floor((venue / 100) * blind);
        var hintStr = '每局扣'+ Util.bigNumToStr2(taifei) +'台费，获得'+ Util.bigNumToStr2(roomScore)+'积分';
        this.popupToast(cc.p(0, size.height/2-60), 5, hintStr, true);
    },
    //自动坐下
    autoSitDown:function(){
        if(!this.isSit) {
            var self = this;
            this.handleOtherSeat(function(seat){//找到没有人的座位坐下
                if(!seat.hold){
                    var canvas = cc.director.getScene().getChildByName('Canvas');
                    canvas.getComponent('PopUp').showLoadding("正在坐下");
                    Game.socket.sendSitDown(parseInt(seat.id));
                    return true;
                }
            });
        }
    },
    //玩家站起动作
    standUp:function(id){
        this.clearSelfSeat();
        this.selectedSeat.node.active = true;
        this.selectedSeat.id = id;
        this.selectedSeat = null;
    },
    //玩家坐下动作
    sitDown:function(seat, pack){
        var canvas = cc.director.getScene().getChildByName('Canvas');
        canvas.getComponent('PopUp').removeLoadding();
        this.isSit = true;
        this.setSelfSeatData(seat.id, 0, pack.seatChips);//用面板代替原来的座位
        this.selectedSeat = seat;
        seat.clearUserData();
        seat.node.active = false;
        this.moveAllPosId(seat.posId);
    },
    logAllSeat:function(){
        for(var i=0; i<this.seats.length; i++){
            var seat = this.seats[i].getComponent('Seat');
            console.log('座位ID: ' + seat.id + "; 状态:" + seat.state);
        }
    },
    //解析坐下包
    parseSitPack:function(pack){
        var self = this;
        var data = {  //数据
            name:pack.nick,
            score:pack.point,
            point:pack.seatChips,
            imgUrl:pack.img,
            uid:pack.uid,
        }
        this.handleOtherSeat(function (seat) {
            if(seat.id == pack.seatId){ 
                console.log('自己坐下'); 
                seat.setUserData(data); 
                seat.state = 0;
                if(pack.uid == Http.userData.uid){ //玩家自己坐下
                    this.sitDown(seat, pack);
                }
            }
        }.bind(this));
    },
    //解析房间包
    parseJoinPack:function(pack){
        for(var i=0;i<pack.playerList.length;i++){
            if(pack.playerList[i].uid == Http.userData.uid){ //如果是自己
                var selfPlayer = pack.playerList[i];
                this.moveAllPosId(selfPlayer.seatId);//旋转座位
                this.setSelfSeatData(selfPlayer.seatId, selfPlayer.state, selfPlayer.seatChips);//加载面板对应的数据
                if(pack.handCardFlag == 1) {//手牌恢复
                    if(pack.handCards[4] == undefined || pack.handCards[4] == 0){
                        pack.handCards.pop();
                        this.selfSeat.getFourPoker(pack.handCards);
                    }else {
                        this.selfSeat.getFourPoker(pack.handCards);
                    }
                };
                this.handleOtherSeat(function (seat) { //自己坐下
                    if(seat.id == selfPlayer.seatId){
                        this.selectedSeat = seat;
                        seat.clearUserData(); 
                        seat.node.active = false;
                    }
                }.bind(this));
                switch(selfPlayer.state){ //自己的状态
                    case 1: //游戏已经开始,有4张牌
                        // if(this.isSit){
                        //     this.selfSeat.showMultipleWin(this.minBuyIn);
                        //     cc.audioEngine.playEffect(cc.url.raw('resources/sound/game_notice.mp3')); 
                        //     this.popupToast(null, 5, '请抢庄:');
                        // }
                        this.showMultipleWin(5);
                        break;
                    case 2: //已经选出庄家,庄家具有倍数,如果不是庄家(给出叫倍)
                        if(selfPlayer.seatId == pack.dealerSeatId) { //自己是庄家
                            this.selfSeat.toBeBanker();
                            this.popupToast(null, 5, '等待玩家选择倍数:');
                            this.selfSeat.setMultiple(selfPlayer.betX);
                        }else{
                            this.selfSeat.showPalyerMultipleWin(this.bankerSeat.point ,this.blind, this.xs);
                            cc.audioEngine.playEffect(cc.url.raw('resources/sound/game_notice.mp3'));
                            this.popupToast(null, 5, '请选择倍数:');
                        }
                        break;
                    case 3: //每个人都已经叫倍,(具有倍数)
                        if(selfPlayer.seatId != pack.dealerSeatId) { //自己不是庄家
                            this.selfSeat.setPlayerMultiple(selfPlayer.betX);
                        }else {
                            this.selfSeat.setMultiple(selfPlayer.betX);
                        }
                        cc.audioEngine.playEffect(cc.url.raw('resources/sound/game_notice.mp3')); 
                        this.selfSeat.showResultPanel();                   
                        break;
                    case 4: //有五张牌,有倍数(庄家有庄家倍数)
                        break;
                };
            }else { //不是自己则根据状态设置
                var self = this;
                this.handleOtherSeat(function (seat) { //找到对应的位置
                    if(seat.id == pack.playerList[i].seatId){
                        switch(seat.state){ //玩家状态
                            case 1: //游戏已经开始,有4张牌
                                seat.getFourPoker();
                                break;
                            case 2: //已经选择抢庄倍数
                                seat.getFourPoker();
                                if(seat.id == pack.dealerSeatId){
                                    seat.toBeBanker();
                                };
                                seat.setMultiple(pack.playerList[i].betX);
                                break;
                            case 3: //每个人都已经叫倍,(具有倍数)   
                                seat.getFivePoker();
                                if(seat.id == pack.dealerSeatId){
                                    seat.toBeBanker();
                                    seat.setMultiple(pack.playerList[i].betX);
                                }else {
                                    seat.setPlayerMultiple(pack.playerList[i].betX);
                                }
                                break;
                            case 4: //有五张牌,有倍数(庄家有庄家倍数)
                                if(pack.gameStatus != 100){ //游戏状态
                                    seat.getFivePoker();
                                    if(seat.id == pack.dealerSeatId){
                                        seat.toBeBanker();
                                        seat.setMultiple(pack.playerList[i].betX);
                                    }else {
                                        seat.setPlayerMultiple(pack.playerList[i].betX);
                                    }
                                    seat.doFinish(); //已经是完成状态
                                }else{
                                    self.popupToast(null, 10, '等待游戏开始', true);
                                }
                                break;
                        };
                    }
                });
            }
        }
    },
    parseStandUpPack:function(pack){
        this.handleOtherSeat(function (seat) {
            if(seat.id == pack.seatId){
                seat.removeUserData();
            }
        });
        if(pack.seatId == this.selfSeat.id){
            if(this.isSelfLeave)//如果主动离开，不做弹框处理
                return;
            var msg = "长时间未操作被踢起！";
            if(pack.seatChips < 1500){ 
                this.standUp(pack.seatId);
            }else {
                var self = this;
                var canvas = cc.director.getScene().getChildByName('Canvas');
                canvas.getComponent('PopUp').showDlg(msg, function(){                
                    self.doLeaveRoom();
                });
            }          
        }
    },
    //操控面板-闲家选择倍数
    showPalyerMultipleWin:function(timeout){
        if(this.isSit && this.selfSeat.state > 0){
            //判断自己是否是庄家
            if(this.selfSeat.id != this.bankerSeat.id){ 
                this.selfSeat.showPalyerMultipleWin(this.bankerSeat.point ,this.blind, this.xs);
                this.popupToast(null, timeout, '请选择倍数:');
                cc.audioEngine.playEffect(cc.url.raw('resources/sound/game_notice.mp3'));
            }else { //是庄家
                this.popupToast(null, timeout, '等待玩家选择倍数:');
            }
        }
        if(this.isSit){
            this.selfSeat.closeSelectMultipleWin();
        }
    },
    //操控面板-抢庄倍数
    showMultipleWin:function(timeout){
        if(this.isSit && this.selfSeat.state > 0){//如果玩家做下 提供玩家叫庄
            this.selfSeat.showMultipleWin(this.minBuyIn);
            cc.audioEngine.playEffect(cc.url.raw('resources/sound/game_notice.mp3')); 
            this.popupToast(null, timeout, '请抢庄:');
        }
    },
    showResultPanel:function(){
        if(this.isSit && this.selfSeat.state > 0){
            setTimeout(function () {
                cc.audioEngine.playEffect(cc.url.raw('resources/sound/game_notice.mp3')); 
                this.selfSeat.showResultPanel();
                this.selfSeat.closePalyerMultipleWin();
            }.bind(this), 1000);
        }
    },
    //坐下失败弹框
    showSitFailWin:function(){
        var canvas = cc.director.getScene().getChildByName('Canvas');
        canvas.getComponent('PopUp').removeLoadding();
        if(Http.userData.point < this.minBuyIn){
            canvas.getComponent('PopUp').showDlg('您的游戏币不足' + Util.bigNumToStr2(this.minBuyIn) + ',请去充值' , function(){
                if(window.gotoPay)
                      window.gotoPay();
            }, function(){});
        }else{
            canvas.getComponent('PopUp').showDlg('坐下失败,请重试', function(){});
        }
    },
    //游戏开始,发四牌,提供叫倍
    startGame:function(pack, startPlayer){
        var self = this;
        var pokers = [pack.handCard1, pack.handCard2, pack.handCard3, pack.handCard4];
        var count = -1;
        var callback = function(){
            ++count;
            if(count == startPlayer.length){ //发牌结束
                self.selfSeat.showHandPoker();//显示玩家手牌
                self.showMultipleWin(pack.timeout);
                return true;
            };
            startPlayer[count].doDealFourPoker_Ani(pokers, callback);
        };
        callback();
        self.selfSeat.closeResultPanel();
    },
    //重新设置游戏状态
    resetGame:function(){
        this.handleAllSeats(function (seat) {
            seat.setMultiple(-1);
            seat.removePokers();
            seat.closePlayerMultiple();
        });
        if(this.oldHint){
            this.oldHint.removeFromParent();
        }
        this.clearBanker();
        //取消所有人的开牌状态
        this.handleOtherSeat(function(seat){
            seat.annulFinish(); 
        });
        //更改游戏状态
        this.gameStatus = 1;
    },
    //开牌
    showAllPokers:function(overPlayers, pack){
        var count = 0;var self = this;
        this.h = sp.loopCall(function(){
            var overData = overPlayers[count++];
            if(!overData)return false;
            if(overData.player.annulFinish){ //取消完成状态
                overData.player.annulFinish(); 
            }
            if(overData&&overData.player){ //开牌
                overData.player.showPokers(overData.pokerType); 
            }
            if(count == overPlayers.length){ //开牌结束
                cc.audioEngine.playEffect(cc.url.raw('resources/sound/game_move_chip.mp3'));
                var flag = false; //自己是否在结算中
                for(var i=0; i<pack.seatChangeList.length; i++){
                    if(self.selfSeat.id == pack.seatChangeList[i].seatId){
                        flag = true;
                        break;
                    }
                }
                if(flag&&self.isSit){ //在结算中出现弹框
                    //弹框
                    self.oldHint.removeFromParent(); //移除等待开牌提示
                    self.endPanel.getComponent('RoundEndBox').showRoundBox(1, overPlayers, this.selfSeat);
                    self.endPanel.getComponent('RoundEndBox').show(5, function () {
                        //金币动画
                        self.startGoldAni(pack, function() {
                            //显示剩余时间
                            self.popupToast(null, 15, '等待游戏开始', true);
                        });
                    });
                }else { //直接动画
                    //金币动画
                    self.startGoldAni(pack, function() {
                        //显示剩余时间
                        self.popupToast(null, 15, '等待游戏开始', true);
                    });
                }
                self.stateToNext();
                return false;
            }
            return true;
        }, this, 0.7);
    },
    //更新座位的游戏币
    updateSeatGold:function(playerList){
        var startPlayer = [];
        for(var i=0;i<playerList.length; i++){
            this.handleAllSeats(function (seat) {
                if(seat.id == playerList[i].seatId){
                    startPlayer.push(seat);//与已经开始游戏的座位对应的seat
                    seat.setScore(playerList[i].seatChips);
                    seat.updateSeat();
                }
            });
        };
        return startPlayer;
    },
    //统计开牌玩家
    getPlayers:function(pack){
        var overPlayers = [];
        this.handleAllSeats(function (seat) {
            for(var i=0; i<pack.playerCardsList.length; i++){
                var palyer = pack.playerCardsList[i];
                if(palyer.seatId == seat.id){
                    var overData = {};//记录下座位和对应数据
                    overData.player = seat; //座位对象
                    overData.change = pack.seatChangeList[i].seatChips;// 变化数
                    overData.pokerType = palyer.cardType; //牌形
                    overPlayers.push(overData);
                    seat.updataHandPoker([palyer.handCard1, palyer.handCard2, palyer.handCard3, palyer.handCard4, palyer.handCard5]);
                }
            }
        });
        return overPlayers;
    },
    //下发第五张牌
    dealFivePoker:function(handCard5){
        cc.audioEngine.playEffect(cc.url.raw('resources/sound/game_deal_card.mp3'));
        this.handleAllSeats(function (seat) {
            if(seat.state > 0){ 
                seat.getLastPoker(handCard5);
            }
        });
    },
});

