cc.Class({
    extends: cc.Component,

    properties: {
        
        promptInfo: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {
        
    },

    //get the prompt information,and show it on the prompt box
    showPromptInfo: function (info) {

        if(this.promptInfo){

            this.promptInfo.string = info || '请点击确定按钮';
        }
    }   
});
