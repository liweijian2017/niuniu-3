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
        // var data = {
        //     name:'测试账号',
        //     point:1000000,
        //     score:100000,
        // }
        // this.handlePanel.setData(data);
    },

    //激活操控面板
    openHandlePanel:function(){
        this.handlePanel.open();
    },
    //停止操控面板
    closeHandlePanel:function(){
        this.handlePanel.close();
    },
    //切换操控面板
    changeHandlePanel:function(){

    },

});