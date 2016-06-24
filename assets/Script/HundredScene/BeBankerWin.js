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
        controlBtn:{
            default:null,
            type:cc.Node
        },
    },

    onLoad: function () {
        this.controlBtn.on(cc.Node.EventType.TOUCH_MOVE, this._handleMove.bind(this), this);
    },

    //窗口初始化 data[{uid:.....}]
    init:function(data){ 
        this.numLabel.string = '1231/123123';
        for(var k in data){
            var noSeatItem = cc.instantiate(this.noSeatPrefab);
            noSeatItem.getComponent('NoSeatItem')._orderId = k;
            noSeatItem.getComponent('NoSeatItem').init(data[k]);
            noSeatItem.parent = this.contentNode;  
        }
    },

    //清空容器
    clearChildren:function(){
        this.contentNode.removeAllChildren();
    },

    //移动滑块
    _handleMove:function(event){
        event.currentTarget.setPosition(event.touch._point);
        console.log(event);
    },
});
