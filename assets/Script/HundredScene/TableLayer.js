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
    	var data = {
        	name:'系统庄家',
        	img:'',
        	point:'1000000000'
        }
        this.setbanker(data);
    },

    setbanker:function(data){
    	this.bankerSeat.setData(data);
    }

});
