var BaseComponent = require('BaseComponent');
cc.Class({
    extends: BaseComponent,

    properties: {
        _point:0, //下注区筹码数
        _isActive:false, //下注区是否打激活中
        _isWin:false, //是否胜利
        _resultText:'',//结果显示
        betPanel:{ //下注区域节点
        	default:null,
        	type:cc.Node
        },
    },

    onLoad: function () {
    	this._isChange = true; //按照默认值更新一次
    	this._resultLabel = this.node.getChildByName('ResultLabel');
    	if(!this.betPanel)return;
		this._iconWin = this.betPanel.getChildByName('IconWin');
		this._iconOpen = this.betPanel.getChildByName('IconOpen');
		this._iconClose = this.betPanel.getChildByName('IconClose');
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
    		this._iconOpen.active = false;
    		this._iconClose.active = true;
    	}else {
    		this._iconOpen.active = true;
    		this._iconClose.active = false;
    	}
    },

});
