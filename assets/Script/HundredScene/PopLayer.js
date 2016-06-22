cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        this._startHint = this.node.getChildByName('StartHint');
        this._toast = this.node.getChildByName('Toast');
    },
    //显示开始提示
    showStartHint:function(){
        this._startHint.active = true;
        this._startHint.getComponent('NodeTransition').show();
        this._startHint.getComponent('NodeTransition').timingHide(null, 2);
    },
    //吐司提示
    showToast:function(str){
        this._toast.active = true;
        this._toast.getChildByName('Lable').getComponent(cc.Label).string = str;
        this._toast.getComponent('NodeTransition').show();
    },
    //关闭吐司提示
    closeToast:function(){
        this._toast.getComponent('NodeTransition').hide();
    },
});
