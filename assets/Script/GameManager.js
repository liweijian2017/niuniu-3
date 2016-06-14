var Http = require('Http');
cc.Class({
    extends: cc.Component,

    properties: {
        mainPage:{
            default:null,
            type:cc.Node
        },
        coursePage:{
            default:null,
            type:cc.Node
        },
    },

    onLoad: function () {
        this.handleCourse();
    },
    //处理新手教程
    handleCourse:function(){
        // if(Http.userData.isNew == 0){
        //     this.coursePage.active = false;
        //     return;
        // }
        // this.mainPage.active = false;
        this.startCourse();
    },
    //开始游戏
    startGame:function(){
        this.mainPage.active = true;
        this.coursePage.active = false;
    },
    startCourse:function(){
        this.mainPage.active = false;
        this.coursePage.active = true;
    },
    showMainPage:function(){
        this.mainPage.active = true;
    },
});
