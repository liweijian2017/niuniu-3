var Game = require('Game');
var Util = require('Util');
cc.Class({
    extends: cc.Component,

    properties: {

        roomIcon: {
            default: null,
            type: cc.Sprite
        },

        roomId: {
            default: null,
            type: cc.Label
        },

        minBuyin: {
            default: null,
            type: cc.Label
        },

        sblind: {
            default: null,
            type: cc.Label
        },

        renIcon: {
            default: null,
            type: cc.Sprite
        },

        onlineNum: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {      
      
    },

    //设置房间信息（id、下限、底分、人数）
    setData: function (roomId, minBuyin, sblind, onlineNum) {
        this.roomId.string = roomId || '0';
        this.minBuyin.string = Util.bigNumToStr2(minBuyin) || '0';
        this.sblind.string = Util.bigNumToStr2(sblind) || '0'; 
        this.onlineNum.string = Util.bigNumToStr2(onlineNum) || '0';
    },
    
    roomItemPressed: function () {       
        this.controlRoomAccessed();
    },

    //判断玩家是否有资格进入该房间
    isRoomAccessed: function () {
        var userPoint = 0;
        var minPoint = parseInt(this.minBuyin.string) || 999999999999;
        var Http = require('Http');
        if(Http.userData.point >= minPoint){
            return true;
        }else{
            return false;
        }
    },

    //控制玩家是否进入房间，如果符合条件，进入，否则提示玩家不能进入该房间
    controlRoomAccessed: function () {
        if(!parseInt(this.roomId.string))
            return;
        var accessed = this.isRoomAccessed();
        var canvas = cc.director.getScene().getChildByName('Canvas');
        if(accessed){
            cc.info("enter room ");          
            canvas.getComponent('PopUp').showLoadding();
            Game.socket.sendJoinRoom(parseInt(this.roomId.string));
            Game.socket.pause();            
        }else{
            cc.info('item pressed');
            canvas.getComponent('PopUp').showDlg('您的游戏币不足，不能进入该房间。去充值吗？', function(){
                    if(window.gotoPay)
                      window.gotoPay();
            }, function(){});
        }
    },    


    onClick: function(){
        this.controlRoomAccessed();
    }
});
