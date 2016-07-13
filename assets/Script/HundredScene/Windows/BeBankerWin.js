var BaseComponent = require('BaseComponent');
var HundredData = require('HundredData');
var Util = require('Util');
cc.Class({
    extends: BaseComponent,
    properties: {
        _selectNum:0, //初始值
        _maxNum:5000, //最大值
        _isRequestBanker:false,
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
        beBankerBtn:{
            default:null,
            type:cc.Node
        },
        bePlayerBtn:{
            default:null,
            type:cc.Node
        }
    },

    onLoad: function () {
        this._isChange = true;
        this.controlBtn.on(cc.Node.EventType.TOUCH_MOVE, this._handleMove.bind(this), this);
    },

    onEnable:function(){
        this.controlBtn.x = 0;
        this.progressBar.progress = 0.5;
        this._selectNum = parseInt(HundredData['userPoint']/2);
        HundredData['requestBankerChips'] = this._selectNum;
        this._maxNum = HundredData['userPoint'];
        this._isRequestBanker = false;
        this._updateNode();
    },

    //窗口初始化 data[{uid:.....}]
    init:function(data){
        for(var k in data){
            var noSeatItem = cc.instantiate(this.noSeatPrefab);
            noSeatItem.getComponent('UserItem')._orderId = k;
            noSeatItem.getComponent('UserItem').init(data[k]);
            noSeatItem.parent = this.contentNode;
            if(data[k].uid == Http.userData.uid){ //自己也在等待上庄
                // HundredData['isRequestBanker'] = true;
                this._isRequestBanker = true;
                this._updateNode();
            }
        }
    },

    _updateNode:function(){
        this.numLabel.string = Util.bigNumToStr(this._selectNum) + '/' + Util.bigNumToStr(this._maxNum);
        if(this._selectNum > HundredData['minDealerBuyin']){ //大于最小上庄值
            if(this.beBankerBtn)
                this.beBankerBtn.opacity = 255;
        }else {
            if(this.beBankerBtn)
                this.beBankerBtn.opacity = 100;
        }
        if(this._isRequestBanker){ //正在请求上庄
            if(this.bePlayerBtn)
                this.bePlayerBtn.active = true;
            if(this.beBankerBtn)
                this.beBankerBtn.active = false;
        }else {
            if(this.bePlayerBtn)
                this.bePlayerBtn.active = false;
            if(this.beBankerBtn)
                this.beBankerBtn.active = true;
        }
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
        this.setAttr('_selectNum', parseInt(this._maxNum*this.progressBar.progress));
        HundredData['requestBankerChips'] = parseInt(this._maxNum*this.progressBar.progress);
    },
});
