//文本提示框
cc.Class({
    extends: cc.Component,
    properties: {
        promptInfo: { //文本内容
            default: null,
            type: cc.Label
        },
        confirmCallback: null, //确定按钮回调函数
        cancelCallback: null, //取消按钮回调函数
    },
    // 初始化
    onLoad: function () {
        this.disabledUnderTouch();
    },
    //设置显示信息与回调函数
    showPromptInfo: function (info, confirmCallback, cancelCallback) {
        if(this.promptInfo){
            this.promptInfo.string = info || '请点击确定按钮';
        }        
        this.confirmCallback = confirmCallback;
        if(typeof cancelCallback != "function")
            this.cancelCallback = confirmCallback;
        else
            this.cancelCallback = cancelCallback;
    },
    /**
     * 提示框出现时，阻止提示框之外的所有组件接收点击事件
     */
    disabledUnderTouch: function () {
        this.node.on('mousedown', function (event) {
          event.stopPropagation();
        }, this);
        this.node.on('touchstart', function (event) {
          event.stopPropagation();
        }, this);
    },
    //确认按钮
    confirmPressed: function () {
        var canvas = cc.director.getScene().getChildByName('Canvas');
        canvas.removeChildByTag(1000);
        if(typeof this.confirmCallback == "function")
            this.confirmCallback();
    },
    //取消按钮
    cancelPressed: function () {        
        var canvas = cc.director.getScene().getChildByName('Canvas');
        canvas.removeChildByTag(1000);
        if(typeof this.cancelCallback == "function")
            this.cancelCallback();
    }
});
