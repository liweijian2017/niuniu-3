var BaseComponent = require('BaseComponent');
cc.Class({
    extends: BaseComponent,

    properties: {
        id:-1, //区域ID
        maxGold:100, //最大金币数
        _point:0, //下注区筹码数
        _isActive:false, //下注区是否打激活中
        _isWin:false, //是否胜利
        _resultText:'',//结果显示
        _golds:[cc.Node], 
        betPanel:{ //下注区域节点
        	default:null,
        	type:cc.Node
        },
    },

    onLoad: function () {
    	this._isChange = true; //按照默认值更新一次
        console.log('百人场-初始化下注区:' + this.id);
        if(!this.betPanel)return;
    	this._resultLabel = this.node.getChildByName('ResultLabel');
		this._iconWin = this.betPanel.getChildByName('IconWin');
		this._iconOpen = this.betPanel.getChildByName('IconOpen');
        this._iconClose = this.betPanel.getChildByName('IconClose');
		this._chipArea = this.node.getChildByName('ChipArea'); //筹码区域
        this.betPanel.on(cc.Node.EventType.TOUCH_END, this._handleClick.bind(this), this);
    },

    start:function(){
    },

    _updateNode:function(){
    	this.betPanel.getChildByName('Bet').getComponent(cc.Label).string = this._point;
    	this._resultLabel.getComponent(cc.Label).string = this._resultText;
    	if(this._isWin)
    		this._iconWin.active = true;
    	else 
    		this._iconWin.active = false;
    	if(this._isActive){
    		this._iconOpen.active = true;
    		this._iconClose.active = false;
    	}else {
    		this._iconOpen.active = false;
    		this._iconClose.active = true;
    	}
    },
    //下注动作
    _handleClick:function(event){
        // 发送下注请求 TODO
        if(!this._isActive)return;
        var event =  new cc.Event.EventCustom('SELECT_BET', true);
        event.setUserData({msg:this.id});
        this.node.dispatchEvent(event);
    },

    addGold:function(node){
        this._chipArea.addChild(node);
        this._golds.push(node);
    },

    updateGolds:function(){
        
    },

    _updateNormal:function(){
        if(this._chipArea.children.length > 100){
            var gold = this._golds.shift();
            this._chipArea.removeChild(gold);
        }
    }
});
