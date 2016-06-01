//聊天窗口
var Game = require('Game');
var Router = require('Router');

cc.Class({
    extends: cc.Component,

    properties: {
        textEdit:{
            default:null,
            type:cc.EditBox
        },
        chatMsgPrefab:{
            default:null,
            type:cc.Prefab
        },
        layout:{
            default:null,
            type:cc.Layout
        },
    },

    // use this for initialization
    onLoad: function () {
        Router.chatWin = this;
    },

    start:function(){
        this.node.active = false;
    },

    //发送信息
    sendMsg:function(){
        var msg = this.textEdit.string;
        if(msg == '' || !msg)return;
        Game.socket.sendMessage(msg);
        this.textEdit.string = '';
        if(Router.tabel){
            Router.tabel.closeChatWin();
        }
    },

    //添加一个聊天记录
    addChatRecord:function(user, content){
        var chatMsg = cc.instantiate(this.chatMsgPrefab);
        chatMsg.getComponent('ChatMsg').setContent(content);
        chatMsg.getComponent('ChatMsg').setName(user.name);
        chatMsg.getComponent('ChatMsg').setHeadImg(user.headImg);
        this.layout.node.addChild(chatMsg);
        this.scheduleOnce(function() {
             chatMsg.getComponent('ChatMsg').updateHeight();
        }, 0.1);
    },

    scrollToBottom:function(){
        if(this.layout.node.height > 350){
            this.scheduleOnce(function() {
                 this.node.getChildByName('ScrollView').getComponent(cc.ScrollView).scrollToBottom();
            }, 0.1);
        }
    },

});
