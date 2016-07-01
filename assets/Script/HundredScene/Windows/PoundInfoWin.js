var BaseComponent = require('BaseComponent');
cc.Class({
    extends: BaseComponent,
    properties: {
        _data:null, //数据
        poundValueLabel:{
            default:null,
            type:cc.Label
        },
        lastValueLabel:{
            default:null,
            type:cc.Label
        },
        lastPokers:{
            default:null,
            type:cc.Node  
        },
        lastTimeLabel:{
            default:null,
            type:cc.Label
        },
        content:{
            default:null,
            type:cc.Node
        },
        noSeatPrefab:{
            default:null,
            type:cc.Prefab
        },
    },

    onLoad: function () {
        this._isChange = true;
    },

    //初始化
    init:function(data){
        this._data = data;
        this._initPokers([data.handCard1, data.handCard2, data.handCard3, data.handCard4, data.handCard5]);
        this._updateNode();
        this._initPlayerList(data.players);
    },

    _updateNode:function(){
        if(!this._data)return;
        this.poundValueLabel.string = this._data.luckPotChips;
        this.lastValueLabel.string = this._data.totalChips;
        this.lastTimeLabel.string = this._data.createTime;
    },

    _initPokers:function(arr){
        for(var k in this.lastPokers.children){
            var poker = this.lastPokers.children[k].getComponent('Poker');
            poker.init(arr[k]);
        }
    },

    _initPlayerList:function(data){ //加载列表
        for(var k in data){
            data[k].readyBuyin = data[k].winChips;
            var noSeatItem = cc.instantiate(this.noSeatPrefab);
            noSeatItem.getComponent('UserItem')._orderId = parseInt(k)+1;
            noSeatItem.getComponent('UserItem').init(data[k]);
            noSeatItem.parent = this.content;
        }
    },
    //关闭窗口回调
    onCloseWin:function(){
        this.content.removeAllChildren();
    },

});
