cc.Class({
    extends: cc.Component,

    properties: {
        _isMove:false,
    },

    onLoad: function () {
        this._startPos = null;
    },

    play:function(){
        if(this._isMove)return;
        this._isMove = true;
        if(!this._startPos){
            this._startPos = this.node.getPosition();
        }
        this.node.setPosition(this._startPos);
        var action = cc.moveTo(0.1, cc.p(this.node.x, this.node.y + 10));
        var action2 = cc.moveTo(0.1, this._startPos);
        var fun = cc.callFunc(function(){
            this._isMove = false;
        }, this);
        this.node.runAction(cc.sequence(action, action2, fun));
    },
});