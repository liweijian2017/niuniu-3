cc.Class({
    extends: cc.Component,
    properties: {
        numLabel:{
            default:null,
            type:cc.Label
        },
        contentNode:{
            default:null,
            type:cc.Node
        },
        noSeatPrefab:{
            default:null,
            type:cc.Prefab
        },
    },

    onLoad: function () {

    },

    //窗口初始化 data[{uid:.....}]
    init:function(data){ 
        this.numLabel.string = data.length + '人';
        for(var k in data){
            var noSeatItem = cc.instantiate(this.noSeatPrefab);
            noSeatItem.getComponent('UserItem').init(data[k]);
            noSeatItem.parent = this.contentNode;  
        }
    },

    clearChildren:function(){
        this.contentNode.removeAllChildren();
    },
});
