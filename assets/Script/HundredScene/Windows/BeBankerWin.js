var BaseComponent = require('BaseComponent');
cc.Class({
    extends: BaseComponent,
    properties: {
        selectNum:5000, //初始值
        maxNum:10000, //最大值
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
        progressBar:{
            default:null,
            type:cc.ProgressBar
        },
    },

    onLoad: function () {
        this._isChange = true;
        this.controlBtn.on(cc.Node.EventType.TOUCH_MOVE, this._handleMove.bind(this), this);
    },

    //窗口初始化 data[{uid:.....}]
    init:function(data){
        for(var k in data){
            var noSeatItem = cc.instantiate(this.noSeatPrefab);
            noSeatItem.getComponent('NoSeatItem')._orderId = k;
            noSeatItem.getComponent('NoSeatItem').init(data[k]);
            noSeatItem.parent = this.contentNode;
        }
    },

    _updateNode:function(){
        this.numLabel.string = this.selectNum + '/' + this.maxNum;
    },

    //清空容器
    clearChildren:function(){
        this.contentNode.removeAllChildren();
    },

    //移动滑块
    _handleMove:function(event){//调整滑块
        event.currentTarget.setPositionX(event.touch._point.x-cc.winSize.width/2);//-event.currentTarget.width/2
        if(this.controlBtn.x < -125){
            this.controlBtn.x = -125;
            this.progressBar.progress = 0;
        }
        if(this.controlBtn.x > 125){
            this.controlBtn.x = 125;
            this.progressBar.progress = 1;
        }
        this.progressBar.progress = (this.controlBtn.x + this.progressBar.totalLength/2)/this.progressBar.totalLength;
        this.setAttr('selectNum', parseInt(this.maxNum*this.progressBar.progress));
    },

});
