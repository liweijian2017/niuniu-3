var HundredSeat = require('HundredSeat');
var HundredBankerSeat = require('HundredBankerSeat');
cc.Class({
    extends: cc.Component,

    properties: {
    	bankerSeat:{
    		default:null,
    		type:HundredBankerSeat
    	},
        seats:[HundredSeat],
    },

    onLoad: function () {
        console.log('百人场-启动-牌桌管理');
    },

    start:function(){
    },
});
