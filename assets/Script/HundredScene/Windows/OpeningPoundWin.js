
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

    init:function(data){
		this.poundValueLabel.string = data.point;
		this._initPokers(data.pokers);
    },

    _initPokers:function(arr){
        for(var k in this.pokers.children){
            var poker = this.pokers.children[k].getComponent('Poker');
            poker.init(arr[k]);
        }
    },
});
