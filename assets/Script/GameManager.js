var Http = require('Http');
cc.Class({
    extends: cc.Component,

    properties: {
        mainPage: {
            default: null,
            type: cc.Node
        },
        coursePage: {
            default: null,
            type: cc.Node
        },
    },

    onLoad: function() {
        if (Http.userData.isNew == 1) { //1是新手,给出教程提示
            this.startCourse();
            Http.userData.point -= 20000;
            if (Http.userData.point < 0) {
                Http.userData.point = 0;
            }
        } else { //老用户直接进入
            this.startGame();
        }
    },
    startCourse: function() { //开始教程
        this.mainPage.active = false;
        this.coursePage.active = true;
    },
    //开始游戏
    startGame: function() {
        if (Http.userData.isNew == 1) { //用户选择不进入教程,直接结束新手教程
            Http.updateNewUser(this.updateUserSucceed.bind(this), function() {});
        } else { //老用户
            this.mainPage.active = true;
            this.coursePage.active = false;
        }
    },
    showMainPage: function() { //点击领取金币,显示主界面
        this.mainPage.active = true;
        Http.userData.point += 10000;
    },
    //成为老用户
    updateUserSucceed: function() {
        Http.userData.point += 20000;
        Http.userData.isNew = 0;
        this.mainPage.active = true;
        this.coursePage.active = false;
    },



});