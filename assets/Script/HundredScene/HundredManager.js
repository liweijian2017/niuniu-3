var Game = require('Game');
var Http = require('Http');
var GameSocket = require('GameSocket');
var P = require('GAME_SOCKET_PROTOCOL');

var Util = require('Util');

var BetLayer = require('BetLayer');
var PopLayer = require('PopLayer');
var IttLayer = require('IttLayer');
var TableLayer = require('TableLayer');
var HundredStates = require('HundredStates');
var HundredData = require('HundredData');
cc.Class({
    extends: cc.Component,
    properties: {
        tableLayer:{ //下注层
            default:null,
            type:TableLayer
        },
        betLayer:{ //下注层
            default:null,
            type:BetLayer
        },
        popLayer:{ //弹框层
            default:null,
            type:PopLayer
        },
        ittLayer:{ //交互层
            default:null,
            type:IttLayer
        }
    },
    onLoad: function () {
        console.log('百人场初始化');
        this.fsm = HundredStates.instance({
            onopenRoom:this._openRoom.bind(this), //加载房间
            onopenBet:this._openBet.bind(this), //打开下注区
            oncloseBet:this._closeBet.bind(this), //关闭下注区
            onsendCards:this._sendCards.bind(this), //发牌
            onopenCards:this._openCards.bind(this), //开牌
            ondividePoint:this._dividePoint.bind(this), //结算
            onenterWaitingBet:this._onbeforeWaitingBet.bind(this), //打开下注区前
        });

        this.mapFun = {  //函数地图
            [P.HUNDRED_SVR_JOIN_SUCCESS] : this.HUNDRED_SVR_JOIN_SUCCESS, //加入百人场房间
            [P.HUNDRED_SVR_SIT_DOWN] : this.HUNDRED_SVR_SIT_DOWN, //坐下成功
            [P.HUNDRED_SVR_SIT_DOWN_FAIL] : this.HUNDRED_SVR_SIT_DOWN_FAIL, //坐下失败
            [P.HUNDRED_SVR_STAND_UP] : this.HUNDRED_SVR_STAND_UP, //站起成功
            [P.HUNDRED_SVR_STAND_UP_FAIL] : this.HUNDRED_SVR_STAND_UP_FAIL, //站起失败
            [P.HUNDRED_SVR_HALFWAY_LEAVE] : this.HUNDRED_SVR_HALFWAY_LEAVE, //中途离开房间
            [P.HUNDRED_SVR_LEAVE_RET] : this.HUNDRED_SVR_LEAVE_RET, //离开房间
            [P.HUNDRED_SVR_MULTI_BET_SUCCESS] : this.HUNDRED_SVR_MULTI_BET_SUCCESS, //下注成功
            [P.HUNDRED_SVR_SYNC_BET_INFO] : this.HUNDRED_SVR_SYNC_BET_INFO, //同步下注信息
            [P.HUNDRED_SVR_BET_FAIL] : this.HUNDRED_SVR_BET_FAIL, //下注失败
            [P.HUNDRED_SVR_GAME_START] : this.HUNDRED_SVR_GAME_START, //游戏开始
            [P.HUNDRED_SVR_GAME_OVER] : this.HUNDRED_SVR_GAME_OVER, //游戏结束
            [P.HUNDRED_SVR_APPLY_DEALER_SUCCESS] : this.HUNDRED_SVR_APPLY_DEALER_SUCCESS, //申请上庄成功
            [P.HUNDRED_SVR_APPLY_DEALER_FAIL] : this.HUNDRED_SVR_APPLY_DEALER_FAIL, //申请上庄失败
            [P.HUNDRED_SVR_CANCEL_DEALER_SUCCESS] : this.HUNDRED_SVR_CANCEL_DEALER_SUCCESS, //服务端取消上庄成功
            [P.HUNDRED_SVR_CANCEL_DEALER_FAIL] : this.HUNDRED_SVR_CANCEL_DEALER_FAIL, //服务端取消上庄失败
            [P.HUNDRED_SVR_NOTIFY_WAITING_DEALER] : this.HUNDRED_SVR_NOTIFY_WAITING_DEALER, //服务端通知客户端,轮到你上庄，但是你不符合条件
            [P.HUNDRED_SRV_LIST_RET] : this.HUNDRED_SRV_LIST_RET, //上庄玩家列表
            [P.HUNDRED_SRV_LIST_NO_SEAT_PLAYER_RET] : this.HUNDRED_SRV_LIST_NO_SEAT_PLAYER_RET, //无座的玩家列表
            [P.HUNDRED_SRV_LIST_RECORD] : this.HUNDRED_SRV_LIST_RECORD, //输赢记录
            [P.HUNDRED_SRV_LIST_LUCK_RECORD] : this.HUNDRED_SRV_LIST_LUCK_RECORD, //上局幸运奖池记录
            [P.HUNDRED_SRV_LIST_LUCK_RECORD_FAIL] : this.HUNDRED_SRV_LIST_LUCK_RECORD_FAIL, //幸运奖池记录失败
            [P.HUNDRED_SRV_ADD_BUYIN_SUCCESS] : this.HUNDRED_SRV_ADD_BUYIN_SUCCESS, //追加成功
        };
    },
    start:function(){
        // if(!Game.socket){ //直接进入百人场
        //     var list = Http.getConfigData().serverList[0];
        //     Game.socket = new GameSocket();
        //     Game.socket.connect(list[0], list[1]);
        //     Game.socket.addEventListener(GameSocket.EVT_PACKET_RECEIVED, this._onProcessPacket, this);//接受服务器包
        //     this.scheduleOnce(function(){
        //         Game.socket.resume();
        //     }, 1);
        //     return;
        // }
        Game.socket.addEventListener(GameSocket.EVT_PACKET_RECEIVED, this._onProcessPacket, this);//接受服务器包
        Game.socket.resume();
    },
    //房间加载
    _openRoom:function(){
        //console.log('房间初始化');
        this.popLayer.showToast('等待游戏开始');
        this.betLayer.closeBetAreas(); //关闭下注区域
        this.ittLayer.closeHandlePanel(); //关闭操作面板
    },
    //打开下注区
    _openBet:function(){
        this.popLayer.showToast('开始下注...');
        this.ittLayer.openHandlePanel(); //打开操作面板权限
    },
    //关闭下注区
    _closeBet:function(){
        this.popLayer.showToast('等待发牌');
        this.ittLayer.closeHandlePanel(); //关闭操作面板
        this.betLayer.closeBetAreas(); //关闭下注区域
    },
    //发牌,然后开牌
    _sendCards:function(){
        this.betLayer.removeAllBetRequest();
        this.popLayer.closeToast();
        this.betLayer.sendPokers(function(){
            this.scheduleOnce(this.fsm.openCards.bind(this.fsm), 1); 
        }.bind(this));
    },
    //开牌
    _openCards:function(){ //接受到GameOver包
        this.betLayer.openPokers();
        this.scheduleOnce(this.fsm.dividePoint.bind(this.fsm), 1); //结算
    },
    //结算
    _dividePoint:function(){
        this.scheduleOnce(function(){
            this.betLayer.reSetBet(); //清理牌桌
            this.popLayer.showToast('等待游戏开始');
        }, 2);
    },
    //打开下注区之后
    _onbeforeWaitingBet:function(){
        this.popLayer.showStartHint(function(){ //开始提示
            this.betLayer.openBetAreas();
        }.bind(this)); //提示
    },
//--------------------------------------------------服务器消息处理--------------------------------------
    //处理服务器包
    _onProcessPacket: function(event){
        var pack = event.data;
        if(!this.mapFun)return;
        if(typeof(this.mapFun[pack.cmd]) == 'function')
            this.mapFun[pack.cmd].call(this, pack);
    },
    //进入房间
    HUNDRED_SVR_JOIN_SUCCESS:function(pack){
        console.log('自己的座位号 : '+pack.seatId);
        HundredData['currentSeatId'] = pack.seatId; //保存当前自己的座位号
        HundredData['minSitdownBuyin'] = pack.minSitdownBuyin;
        HundredData['minDealerBuyin'] = pack.minDealerBuyin;
        HundredData['betAreas'].point = pack.luckPotChips;
        //还原操控面板
        if(pack.seatId == 0){ 
            HundredData['handlePanel']['type'] = 2;
        }else if(pack.seatId>0 && pack.seatId < 5){ //在座位上
            HundredData['handlePanel']['type'] = 1;
        }else { //没有坐下
            HundredData['handlePanel']['type'] = 0;
        }
        HundredData['handlePanel'].point = Http.userData.score;
        //还原所有座位信息
        for(var k in pack.playerList) { 
            if(pack.playerList[k].seatId == 0) { //庄家
                HundredData['banker']['point'] = pack.playerList[k].buyinChips;
                HundredData['banker']['name'] = pack.playerList[k].nick;
            }
            if(pack.playerList[k].seatId < 5 && pack.playerList[k].seatId > 0) { //有座位玩家
                HundredData['seats'][pack.playerList[k].seatId]['name'] = pack.playerList[k].nick;
                HundredData['seats'][pack.playerList[k].seatId]['point'] = pack.playerList[k].buyinChips;
                HundredData['seats'][pack.playerList[k].seatId]['img'] = pack.playerList[k].img;
                HundredData['seats'][pack.playerList[k].seatId]['isHold'] = true;
            }
            if(pack.playerList[k].seatId == pack.seatId){ //拿到自己的信息
                if(pack.seatId == 0) { //自己是庄家
                    HundredData['handlePanel']['point'] = pack.playerList[k].otherChips;
                    HundredData['handlePanel']['2'].gain = pack.playerList[k].totalWinChips;
                    HundredData['handlePanel']['2'].lose = pack.playerList[k].totalLoseChips;
                    HundredData['handlePanel']['2'].total = pack.playerList[k].totalWinChips - pack.playerList[k].totalLoseChips;
                    //HundredData['userPoint'] = pack.playerList[k].otherChips;
                }else { //不是庄家
                    HundredData['handlePanel'].point = pack.playerList[k].buyinChips;
                    HundredData['acceptChips'] = pack.playerList[k].buyinChips;
                    // HundredData['userPoint'] = pack.playerList[k].buyinChips;
                }
                HundredData['handlePanel']['name'] = pack.playerList[k].nick;
            }
        }
        //下注池还原
        for(var k in pack.pots){ 
            HundredData['betAreas'][pack.pots[k].potId].point = pack.pots[k].totalChips;
            HundredData['betAreas'][pack.pots[k].potId].selfPoint = pack.pots[k].meBetChips;
        }
        this.betLayer.restoreBetChips();
        //游戏状态还原
        if(pack.gameStatus == 1){ //正在下注中
            this.fsm.openRoom();
            this.fsm.openBet();
        }else if(pack.gameStatus == 2){ //同步包停止, 等待游戏结束包
            this.fsm.openRoom();
            this.fsm.openBet();
            this.fsm.closeBet();
        }else if(pack.gameStatus == 100){//接到gameover等待游戏开始中
            this.fsm.openRoom();
        }else if(pack.gameStatus == 0){ //房间还没有人
            this.fsm.openRoom();
        }
    },
    //游戏开始
    HUNDRED_SVR_GAME_START:function(pack){
        HundredData['syncBetData'].seatId = -1; //清空需要同步的信息
        HundredData['syncBetData'].bets = []; //清空需要同步的信息
        // console.log('庄家可接受下注: ' + pack.acceptChips);
        HundredData['acceptChips'] = pack.acceptChips;
        if(Http.userData.uid == pack.uid){ //自己是庄家
            if(HundredData['handlePanel'].type == 1){ //当时是坐下的
                HundredData['seats'][HundredData['currentSeatId']]['isHold'] = false;
            }
            HundredData['handlePanel']['type'] = 2;
            HundredData['handlePanel']['point'] = pack.otherChips;
            HundredData['currentSeatId'] = 0;
        }else { //庄家是别人
            if(HundredData['currentSeatId'] == 0) { //下庄
                HundredData['handlePanel']['type'] = 0;
                HundredData['currentSeatId'] = 99;
                for(var k in pack.playerList){
                    if(pack.playerList[k].seatId == 99){ //自己座位
                        HundredData['handlePanel']['point'] = pack.playerList[k].buyinChips;;
                    }
                }
            }
        }
        //更新庄家信息
        HundredData['banker']['point'] = pack.buyinChips;
        HundredData['banker']['name'] = pack.nick;
        HundredData['banker']['uid'] = pack.uid;
        //开始下注  
        this.fsm.openBet(); 
    },
    //游戏结束
    HUNDRED_SVR_GAME_OVER:function(pack){
        //更新庄家面板
        if(HundredData['currentSeatId'] == 0){
            HundredData['handlePanel']['2']['gain'] = pack.totalWinChips;
            HundredData['handlePanel']['2']['lose'] = pack.totalLoseChips;
            HundredData['handlePanel']['2']['total'] = pack.totalWinChips - pack.totalLoseChips;
        }
        HundredData['banker'].pokers = {
            '0':pack.dealerCard1,
            '1':pack.dealerCard2,
            '2':pack.dealerCard3,
            '3':pack.dealerCard4,
            '4':pack.dealerCard5,
        };
        HundredData['banker'].cardType = pack.dealerCardType;
        var recordMsg = [];
        for(var k=0; k<pack.pokers.length; k++){ //下注区域牌
            HundredData['betAreas'][k+1].pokers = {
                '0':pack.pokers[k].handCard1,
                '1':pack.pokers[k].handCard2,
                '2':pack.pokers[k].handCard3,
                '3':pack.pokers[k].handCard4,
                '4':pack.pokers[k].handCard5,
            }
            HundredData['betAreas'][k+1].cardType = pack.pokers[k].cardType;
            HundredData['betAreas'][k+1].multiple = pack.pokers[k].multiple;
            if(pack.pokers[k].multiple > 0){ //闲家赢了
                recordMsg.push(1);
            }else {
                recordMsg.push(0);
            }
        }
        HundredData['recordArr'].splice(0,0,recordMsg); //在arr头部添加一个新记录
        //最后奖池信息
        var betLastPoint = {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
        };
        for(var j in pack.bets){ //校正所有的同步消息
            var betMsg = pack.bets[j];
            if(betMsg.betChips == 0)continue;
            betLastPoint[betMsg.potId] = betMsg.betChips; //校正奖池筹码
            if(betMsg.seatId == 99){ //自己的投注
                if(!Util.contains(HundredData['betAreas'][betMsg.potId].participators, 5)){
                    HundredData['betAreas'][betMsg.potId].participators.push(5);
                    // console.log('自己的投注:' + betMsg.betChips);
                }
            }else if(betMsg.seatId == 100){ //无座玩家(如果自己也是无座玩家)
                if(!Util.contains(HundredData['betAreas'][betMsg.potId].participators, 6)){
                    HundredData['betAreas'][betMsg.potId].participators.push(6);
                    // console.log('无座玩家投注:' + betMsg.betChips);
                }
            }else { //座位上的投注
                if(betMsg.seatId != pack.seatId){
                    if(!Util.contains(HundredData['betAreas'][betMsg.potId].participators, betMsg.seatId))
                        HundredData['betAreas'][betMsg.potId].participators.push(betMsg.seatId);
                } 
            }
        }
        HundredData['betAreas'][1].point = betLastPoint[1];
        HundredData['betAreas'][2].point = betLastPoint[2];
        HundredData['betAreas'][3].point = betLastPoint[3];
        HundredData['betAreas'][4].point = betLastPoint[4];
        //最后所有座位筹码变动信息
        HundredData['seatChangeList'] = pack.seatChangeList;
        //赢取筹码
        HundredData['winnersList'] = pack.winners;
        if(pack.luckChips > 0) { //存储奖池信息
            HundredData['luckPound'].luckChips = pack.luckChips;
            var betInfo = pack.pokers[pack.luckPotId-1];
            HundredData['luckPound'].luckPokers = [betInfo.handCard1, betInfo.handCard2, betInfo.handCard3, betInfo.handCard4, betInfo.handCard5];
        }
        this.fsm.sendCards();
    },
    //下注成功
    HUNDRED_SVR_MULTI_BET_SUCCESS:function(pack){
        HundredData['acceptChips'] = pack.meAcceptChips < pack.dealerAcceptChips ? pack.meAcceptChips : pack.dealerAcceptChips;
        for(var k in pack.betsResult){
            var bet = pack.betsResult[k];
            HundredData['betAreas'][bet.potId].selfPoint = bet.betChips;
            this.betLayer.sendPoint(5, bet.potId-1, this.betLayer._chipsToGold(bet.betChips));
        }
        HundredData['isAttend'] = true;
    },
    //下注失败
    HUNDRED_SVR_BET_FAIL:function(pack){
        console.log('下注失败');
        HundredData['acceptChips'] = pack.acceptChips;
        console.log(pack);
    },
    //坐下成功
    HUNDRED_SVR_SIT_DOWN:function(pack){ 
        HundredData['seats'][pack.seatId]['isHold'] = true;
        //如果是自己坐下,操控面板处理
        if(pack.uid == Http.userData.uid){
            this.popLayer.showHint('坐下成功');
            HundredData['currentSeatId'] = pack.seatId;//更新自己的座位id
            HundredData['handlePanel']['type'] = 1;
        }
        HundredData['seats'][pack.seatId]['name'] = pack.nick;
        HundredData['seats'][pack.seatId]['point'] = pack.buyinChips;
        HundredData['seats'][pack.seatId]['img'] = pack.img;
        HundredData['seats'][pack.seatId]['uid'] = pack.uid;
    },
    //坐下失败
    HUNDRED_SVR_SIT_DOWN_FAIL:function(pack){
        // this.popLayer.showHint('坐下失败');
        console.log(pack);
    },
    //同步下注
    HUNDRED_SVR_SYNC_BET_INFO:function(pack){ 
        if(pack.isEnd == 1){ //下注结束
            this.fsm.closeBet();//关闭下注
        }
        for(var k in pack.bets) {//同步金币变化
            if(pack.seatId == pack.bets[k].seatId){
                HundredData['betAreas'][pack.bets[k].potId].point = pack.bets[k].betChips;
                return;
            }
            if(pack.bets[k].betChips > HundredData['betAreas'][pack.bets[k].potId].point) { //奖池有人投注了
                var changePoint = pack.bets[k].betChips - HundredData['betAreas'][pack.bets[k].potId].point;
                var seatId = pack.bets[k].seatId;
                // console.log((seatId>5?5:seatId) + '座位下注 :' + changePoint + '筹码,到' + pack.bets[k].potId + '奖池;');
                this.betLayer.sendPoint((seatId>5?6:seatId), pack.bets[k].potId-1, this.betLayer._chipsToGold(changePoint));
            }
        }
    },
    //申请上庄成功
    HUNDRED_SVR_APPLY_DEALER_SUCCESS:function(pack){ 
        console.log('申请上庄成功');
        this.popLayer.showHint('申请上庄成功');
        this.popLayer.closeBeBankerWin();
    },
    //申请上庄失败
    HUNDRED_SVR_APPLY_DEALER_FAIL:function(pack){
        console.log('申请上庄失败');
        this.popLayer.showHint('申请上庄失败');
        console.log(pack)
    },
    //站起成功
    HUNDRED_SVR_STAND_UP:function(pack){ 
        HundredData['seats'][pack.seatId]['uid'] = 0;
        //处理操控面板
        if(HundredData['currentSeatId'] == pack.seatId){
            console.log('站起成功');
            this.popLayer.showHint('站起成功'); 
            HundredData['currentSeatId'] = 99;
            HundredData['handlePanel']['type'] = 0;
        }
        HundredData['seats'][pack.seatId]['isHold'] = false;
    },
    //站起失败
    HUNDRED_SVR_STAND_UP_FAIL:function(pack){ 
        console.log('站起失败');
        this.popLayer.showHint('站起失败');  
        console.log(pack);
    },
    //取消上庄成功
    HUNDRED_SVR_CANCEL_DEALER_SUCCESS:function(pack){
        this.popLayer.closeBeBankerWin();
        console.log('成功请求下庄');
        this.popLayer.showHint('成功请求下庄');  
    },
    //取消上庄失败
    HUNDRED_SVR_CANCEL_DEALER_FAIL:function(pack){ 
        console.log('请求下庄失败');
        this.popLayer.showHint('请求下庄失败');  
    },
    //轮到上庄,条件不满足
    HUNDRED_SVR_NOTIFY_WAITING_DEALER:function(pack){  //TODO
        console.log('轮到上庄,条件不满足');
        this.popLayer.showHint('上庄条件不满足');
    },
    //上庄玩家列表
    HUNDRED_SRV_LIST_RET:function(pack){
        this.popLayer.openBeBankerWin(pack.players);
    },
    //无座的玩家列表
    HUNDRED_SRV_LIST_NO_SEAT_PLAYER_RET:function(pack){
        console.log(pack);
        this.popLayer.openPlayerListWin(pack.players);
    },
    //输赢记录
    HUNDRED_SRV_LIST_RECORD:function(pack){
        var data = [];
        for(var k = pack.records.length-1, i=0; k>0; k--){
            i++;
            if(i > 7) break;
            data.push([pack.records[k][1], pack.records[k][2],pack.records[k][3],pack.records[k][4]]);
        }
        HundredData['recordArr'] = data;
        this.popLayer.openRecordWin(HundredData['recordArr']);
    },
    //上局幸运奖池记录
    HUNDRED_SRV_LIST_LUCK_RECORD:function(pack){
        pack.createTime = Util.formatDate(pack.createTime);
        this.popLayer.openPoundInfoWin(pack);
    },
    //幸运奖池记录失败
    HUNDRED_SRV_LIST_LUCK_RECORD_FAIL:function(pack){
        console.log('请求幸运奖池记录失败');
        console.log(pack);
    },
    //0:正常, 1:超时 2:没钱
    HUNDRED_SVR_LEAVE_RET:function(pack){ 
        console.log('离开房间');
        // console.log(pack);
        HundredData['handlePanel'].preType = -2
        HundredData['handlePanel']['type'] = -1;
        HundredData.removeAllHandles();
        cc.director.loadScene('MainScene');
    },
    //中途离开房间
    HUNDRED_SVR_HALFWAY_LEAVE:function(pack){
    },
    //追加成功
    HUNDRED_SRV_ADD_BUYIN_SUCCESS:function(pack){
        this.popLayer.closeAddChumaWin();
        this.popLayer.showHint('追加成功!');
        HundredData['handlePanel']['point'] = pack.otherChips;
        HundredData['banker']['point'] += pack.totalAddBuyin;
    }
});
