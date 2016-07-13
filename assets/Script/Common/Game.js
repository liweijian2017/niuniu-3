/*
游戏全局对象
*/
var Http = require('Http');
var GameSocket = require('GameSocket');
var P = require('GAME_SOCKET_PROTOCOL');
var BroadcastReceiver = require('BroadcastReceiver');
var Router = require('Router');
var Game = cc.Class({
    extends: cc.Component,
    properties: {
        boradcastItemPrefab:{
            default:null,
            type:cc.Prefab
        },
    },
    onLoad: function () {      
        if(!Game.socket) {
            var list = Http.getConfigData().serverList[0];
            Game.socket = new GameSocket();
            Game.socket.connect(list[0], list[1]);
        };
        //初始化广播接收器
        Router.boradcastItemPrefab = this.boradcastItemPrefab;
        BroadcastReceiver.init(); //初始化
    },
});


// Array.prototype.contains = function(item){ //添加数组包含判断
//     return RegExp("\\b"+item+"\\b").test(this);
// };
