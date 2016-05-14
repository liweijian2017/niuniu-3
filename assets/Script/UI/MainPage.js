cc.Class({
    extends: cc.Component,

    properties: {

        score: {
            default: null,
            type: cc.Label
        },

        point: {
            default: null,
            type: cc.Label
        },

        userIcon: {
            default: null,
            type: cc.Sprite
        },

        onLineAll: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {

        this.setUserData();
    },
    
    //玩家进入游戏后设置玩家的头像、积分、筹码等
    setUserData: function () {
        var me = this;
        var Http  = require('Http');
        var ImageLoader = require('ImageLoader');
        var userData = Http.getUserData();
        var score = userData.score || 0;
        var point = userData.point || 0;
        var onLineAllNum = Http.getOnlineAll() || 0;
        var url = userData.image;
        this.score.string = score;
        this.point.string = point;
        this.onLineAll.string = '活跃人数：' + onLineAllNum + '人';
        ImageLoader.load(url, function(ret, node){
            if(ret) {
                node.parent = me.userIcon.node;
                var scaleInfo = me.getScaleNum(me.userIcon.node.width, me.userIcon.node.height, node.width, node.height);
                node.scaleX = scaleInfo.scaleX;
                node.scaleY = scaleInfo.scaleY;
            }                 
                                               
        });
    },

    //获得玩家的头像和预设置的图像宽高的比值
    getScaleNum: function (w1, h1, w2, h2) {

        var scaleX = w1 / w2 || 1;
        var scaleY = h1 / h2 || 1;

        return {scaleX: scaleX, scaleY: scaleY};
    }


});





