/*
游戏全局对象
*/
var Http = require('Http');
var GameSocket = require('GameSocket');
var Game;
Game = cc.Class({
    extends: cc.Component,
    properties: {},
    statics: {
        instance: null
    },

    // use this for initialization
    onLoad: function () {
        Game.instance = this;

        var list = Http.getConfigData().serverList[0];
        this.socket = new GameSocket();
        this.socket.connect(list[0], list[1]);

       /* this.socket.addEventListener(GameSocket.EVT_PACKET_RECEIVED, function(event){
            cc.info(event.data);
        }, this);   */      
    },

});
