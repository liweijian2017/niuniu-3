cc.Class({
    extends: cc.Component,

    properties: {
        _isChange:false,
    },

    onLoad: function () {
        //设置初始数据
        this._isChange = true;
    },

    update:function(){
        if(this._updateNormal)this._updateNormal();
        if(!this._isChange)return;
        this._updateNode();
        this._isChange = false;
    },
    //修改属性
    setAttr:function(name, value){
        if(!this.hasOwnProperty(name))
            throw new Error("没有对应的属性:" + name);
        this[name] = value;
        this._isChange = true;
    },

    _updateNode:function(){
    },
    
});
