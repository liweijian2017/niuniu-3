cc.Class({
    extends: cc.Component,

    properties: {
        
        promptInfo: {
            default: null,
            type: cc.Label
        },

        confirmCallback: null,
        cancelCallback: null,
    },

    // use this for initialization
    onLoad: function () {
        this.disabledUnderTouch();
    },

    //get the prompt information,and show it on the prompt box
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
    
        //confirm button which in the prompt box was pressed
    confirmPressed: function () {

        var canvas = cc.director.getScene().getChildByName('Canvas');
        canvas.removeChildByTag(1000);
        if(typeof this.confirmCallback == "function")
            this.confirmCallback();
    },

    //cancel button which in the prompt box was pressed
    cancelPressed: function () {        
        var canvas = cc.director.getScene().getChildByName('Canvas');
        canvas.removeChildByTag(1000);
        if(typeof this.cancelCallback == "function")
            this.cancelCallback();
    }
});
