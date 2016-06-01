var Http  = require('Http');
var Util = require('Util');
var GameData = require('GameData');
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
        },

        logo: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        GameData.IN_GAME = 0;
        this.setUserData();
        var action  = cc.moveBy(0.8, 0, 10);
        action.easing(cc.easeElasticIn  (1));
        
        var action2  = cc.moveBy(0.8, 0, -10);
        action2.easing(cc.easeElasticOut  (1));
        this.logo.runAction(cc.repeatForever(cc.sequence(action, action2)));
    },
    
    //玩家进入游戏后设置玩家的头像、积分、筹码等
    setUserData: function () {
        var me = this;        
        var ImageLoader = require('ImageLoader');
        var userData = Http.userData;
        this.scoreHandler_ = userData.addDataObserver('score', function(){
            me.score.string = Util.bigNumToStr(this.score);
        });

        this.pointHandler_ = userData.addDataObserver('point', function(){
            me.point.string = Util.bigNumToStr(this.point);
        });

        this.getOnlineReq_ = Http.getOnlineAll(function(data){            
            me.onLineAll.string = '在线人数：' + data.count + '人';
        });
        var url = userData.image; 

       
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
    },

    onDestroy: function(){
        Http.cancelRequest(this.getOnlineReq_);
        Http.userData.removeDataObserver("score", this.scoreHandler_ );
        Http.userData.removeDataObserver("point", this.pointHandler_ );

    }
});





