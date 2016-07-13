//交互层
var Game = require('Game');
var HandlePanel = require('HandlePanel');
var HundredData = require('HundredData');
var PopLayer = require('PopLayer');
var HundredStates = require('HundredStates');

cc.Class({
    extends: cc.Component,

    properties: {
        handlePanel:{
            default:null,
            type:HandlePanel
        },
        beBankerIcon:{
            default:null,
            type:cc.Sprite
        },
        standBtn:{
            default:null,
            type:cc.Node
        },
        spriteAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        popLayer:{ //弹框层
            default:null,
            type:PopLayer
        },
    },

    onLoad: function () {
        console.log('百人场-初始化交互层');
        HundredData.bindCallF('handlePanel:type', this._updateType.bind(this));
    },

    _updateType:function(type){
        if(type == 2) {
            this.beBankerIcon.spriteFrame = this.spriteAtlas.getSpriteFrame('fnt_xiazhuang');
        }else {
            this.beBankerIcon.spriteFrame = this.spriteAtlas.getSpriteFrame('fnt_shangzhuang');
        }
        if(type == 1) { //坐下状态
            this.standBtn.active = true;
        }else {
            this.standBtn.active = false;
        }
        return type;
    },

    //激活操控面板
    openHandlePanel:function(){
        // console.log('激活操控面板');
        this.handlePanel.open();
    },
    //停止操控面板
    closeHandlePanel:function(){
        this.handlePanel.close();
        // console.log('停止操控面板');
    },

    //发送比赛记录请求
    sendRecordRequest:function(){
        if(HundredData['recordArr'].length == 0){
            Game.socket.sendRequestListRecord_Hundred();
            return;
        }
        var arr = HundredData['recordArr']; //拷贝出一个新
        var data = [];
        for(var k=0; k<arr.length; k++){ //读取前7个
            if(k > 7) break;
            data.push([arr[k][0], arr[k][1],arr[k][2],arr[k][3]]);
        }
        this.popLayer.openRecordWin(data);
    },
    //发送待上庄的玩家列表请求
    sendBeBankerListRequest:function(){
        if(HundredData['handlePanel'].type == 2) { //下庄
            this.sendRequestBePlayer();
            return;
        }
        Game.socket.sendRequestListDealer_Hundred();
    },
    //发送无座的玩家列表请求
    sendPlayerListRequest:function(){
        Game.socket.sendRequestListNoSeatDealer_Hundred();
    },
    //发送比赛记录请求
    sendPoundInfoRequest:function(){
        Game.socket.sendLuckRecord_Hundred();
    },
    //发送上庄请求
    sendRequestBeBanker:function(){
        if(HundredData['requestBankerChips'] < 0)return;
        if(HundredData['requestBankerChips'] < HundredData['minDealerBuyin'])return;
        Game.socket.sendApplyBanker_Hundred(HundredData['requestBankerChips']);
    },
    //发送下庄请求
    sendRequestBePlayer:function(){
        Game.socket.sendCancelBanker_Hundred();
    },
    //发送站起请求
    sendStandUpRequest:function(){
        Game.socket.sendStandUp_Hundred();
    },

    //发送加注请求
    sendAddBuyinRequest:function(){
        if(HundredData['requestBankerChips'] < 0)return;
        Game.socket.sendAddBuyin_Hundred(HundredData['requestBankerChips']);
    },

    //离开房间
    leaveRoom:function(){
        if(HundredStates.getFsm().is('WaitingStart') || HundredStates.getFsm().is('NullState')){
            Game.socket.sendLeaveRoom_Hundred();
            var canvas = cc.director.getScene().getChildByName('Canvas');
            canvas.getComponent('PopUp').showLoadding("正在离开");
        }else {
            var canvas = cc.director.getScene().getChildByName('Canvas');
            canvas.getComponent('PopUp').showDlg('正在打牌中,不能逃跑'); 
        }
        
    }

});