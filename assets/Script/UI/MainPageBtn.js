var Http = require('Http');
var GameData = require('GameData');
var Game = require("Game");
cc.Class({
    extends: cc.Component,

    properties: {

        menuSprites: {
            default: [],
            type: cc.SpriteFrame
        },

        menuPrefab: {
            default: null,
            type: cc.Prefab
        },
        
        playerInfo: {
            default: null,
            type: cc.Node
        },

        mainNode: {
            default: null,
            type: cc.Node
        },
        
        returnBtn: {
            default: null,
            type: cc.Node
        },
        
        menuBtn: {
            default: null,
            type: cc.Node
        },

        roomList: {
            default: null,
            type: cc.Node
        },

        menuState: 0
    },

    // use this for initialization
    onLoad: function () {
        if(GameData.IN_HALL == 1)
            this.roomListPressed();
        else
            this.onReturnClick();
    },

    //打开菜单
    menuPressed: function () {
        if(this.menuState == 1){
            this.menuState = 0;
            this.menuBtn.getComponent(cc.Sprite).spriteFrame = this.menuSprites[0];
            if(this.menu){
                this.playerInfo.parent.removeChild(this.menu);
            }
        }
        else if(this.menuState == 0){
            this.menuState = 1;
            this.menuBtn.getComponent(cc.Sprite).spriteFrame = this.menuSprites[1];
            this.menu = cc.instantiate(this.menuPrefab);
            this.menu.parent = this.playerInfo.parent;
            var me = this;
            this.menu.on(cc.Node.EventType.TOUCH_END, function(){
                me.menuPressed();
            });

        }else if(this.menuState == 2){
            //todo
        }
    },

    //快速开始   
    startPressed: function () {
        GameData.IN_HALL = 0;
       var canvas = cc.director.getScene().getChildByName('Canvas');
       if(Http.userData.point < 1500)
       {
          canvas.getComponent('PopUp').showDlg('您的游戏币不足, 去充值吗？', function(){
                if(window.gotoPay)
                    window.gotoPay();
          }, function(){});
       }
       else
       {
           //Http.quickGame(function(data){
           Game.socket.pause();
           var canvas = cc.director.getScene().getChildByName('Canvas');
           canvas.getComponent('PopUp').showLoadding();
           Game.socket.sendQuickStart();
           //});
        }
    },
    
     //进入房间列表界面
    roomListPressed: function () {
        this.mainNode.active = false;
        this.roomListIn();
        this.menuBtn.active = false;
        this.returnBtn.active = true;
        GameData.IN_HALL = 1;
    },
    
    
    //返回主界面
    onReturnClick:function(){
        this.roomList.active = false;
        this.mainNode.active = true;
        
        this.menuBtn.active = true;
        this.returnBtn.active = false;
        GameData.IN_HALL = 0;
    },

    roomListIn: function () {
        this.roomList.active = true;
    },

    gotoPay: function(){
        if(window.gotoPay)
        {
            window.gotoPay();
        }       
    },
});
