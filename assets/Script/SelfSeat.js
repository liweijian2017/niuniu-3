//自己的座位(带有操控面板的)
var Seat = require("Seat");

cc.Class({
    extends: Seat,
    properties: {
        selectMultipleWin:{
            default:null,
            type:cc.Node
        },
        palyerMultipleWin:{
            default:null,
            type:cc.Node
        },
        resultPanel:{
            default:null,
            type:cc.Node
        },
        // playerMultiple:5, //5, 10, 15, 20, 25 闲家倍数
        count:0, //总数
    },

    // use this for initialization
    onLoad: function () {
        //建立事件,计算牌结果
        this.node.on('COUNT_POKER', function(event){
            var num = event.getUserData().msg;
            this.count += num;
            this.resultPanel.getComponent('ResultPanel').addPoker(num);
            //刷新显示
            event.stopPropagation();
        }, this);        
    },
    
    // showPokers:function () {
    //     console.log('自己的座位,不需要开牌');
    // },
    
    //拿到4张牌,设置可见
    getFourPoker:function (data) {
        //拿到的对象为(自己的手牌类对象)
        var handpoker = this.handSeat.getComponent('SelfHandPoker');
        handpoker.setPokers(data); //发4张牌
        handpoker.show();
    },
    //叫倍选择(阻塞)设置回调
    showMultipleWin:function () {
        //1.显示倍数弹框
        this.selectMultipleWin.active = true;
        //2.监听用户点击
        this.node.on('SELECT_MULTIPLE', function(event){
            //3.拿到倍数显示
            this.setMultiple(event.getUserData().msg);
            //4.关闭窗口
            this.selectMultipleWin.active = false;
        }, this);
    },
      
    showPalyerMultipleWin:function () {
        this.palyerMultipleWin.active = true;
        this.node.on('PLAYER_SELECT_MULTIPLE', function(event){
                this.palyerMultipleWin.active = false;
                this.playerMultiple = event.getUserData().msg;
        }, this);
    },
    
    showResultPanel:function () {
        this.resultPanel.active = true;
        this.handSeat.getComponent('HandPoker').addPokerTouch();
    },
    
    //拿到最后一张牌
    getLastPoker:function (onePoker) {
        Seat.prototype.getLastPoker.call(this, onePoker);
        this.handSeat.getComponent('HandPoker').show();
    },
    //关闭计算窗口
    closeResultPanel:function () {
        this.resultPanel.active = false;
    },
    closeSelectMultipleWin:function () {
        this.selectMultipleWin.active = false;
    },
    closePalyerMultipleWin:function () {
        this.palyerMultipleWin.active = false;
    },
    
});
