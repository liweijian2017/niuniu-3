var HundredData = require('HundredData');

cc.Class({
    extends: cc.Component,

    properties: {
        poundValueLabel:{
            default:null,
            type:cc.Label
        },
    	pokers:{
            default:null,
            type:cc.Node  
        },
    },

    onLoad: function () {
    	
    },

    onEnable:function(){
        if(HundredData['luckPound'].luckChips <= 0)return;
        var data = {
            point: HundredData['luckPound'].luckChips,
            pokers:HundredData['luckPound'].luckPokers,
        };
        console.log(data);
        this.init(data);
    },

    init:function(data){
		this.poundValueLabel.string = data.point;
		this._initPokers(data.pokers);
    },

    _initPokers:function(arr){
        if(arr.length != 5)return;
        for(var k in this.pokers.children){
            var poker = this.pokers.children[k].getComponent('Poker');
            poker.init(arr[k]);
        }
    },
});
