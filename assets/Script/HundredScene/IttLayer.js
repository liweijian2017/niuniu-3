//交互层
var HandlePanel = require('HandlePanel');
cc.Class({
    extends: cc.Component,

    properties: {
        handlePanel:{
            default:null,
            type:HandlePanel
        },
    },

    onLoad: function () {
        console.log('百人场-初始化交互层');
        var data = {
            name:'测试账号',
            point:1000000,
            score:100000,
        }
        this.handlePanel.setData(data);

    },

    //打开
    openHandlePanel:function(){
        this.handlePanel.open();
    },
    //关闭
    closeHandlePanel:function(){
        this.handlePanel.close();
    },

});