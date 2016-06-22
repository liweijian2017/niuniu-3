var CoursePackData = require('CoursePackData');
var Http = require('Http');
cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function() {
        this.tableManager = null;
        this.coursePage = this.node.getComponent('CoursePage');
    },
    init: function() {
        //找到tableManager对象
        this.tableManager = cc.director.getScene().getChildByName('Canvas').getComponent('TableManager');
        if (!this.tableManager) return;
        this.startSend();
    },

    startSend: function() {
        this.tableManager.handleLocalPacket(CoursePackData['JOIN']); //进入房间
        this.tableManager.handleLocalPacket(CoursePackData['SITDOWM']); //自己坐下
        this.tableManager.handleLocalPacket(CoursePackData['GAMESTART']); //游戏开始
        this.coursePage.updatePage(11); //关闭指引,阻塞事件
        this.scheduleOnce(function() {
            this.tableManager.handleLocalPacket(CoursePackData['PLAYERBEI']); //闲家叫倍
        }, 2);

        this.scheduleOnce(function() {//弹出提示指引(阻塞)
            var page = this.coursePage.updatePage(7);
            var btn = cc.find("Canvas/Table/SelfSeat/SelectMultiple/Layout/Btn4");
            if(btn){
                btn.maskEvent = this.startSend2.bind(this);
                page.getComponent('MaskLayer').addMaskNode(btn);
            }
        }, 3);
    },
    //用户选择倍数之后
    startSend2:function(){
        this.coursePage.updatePage(11); //关闭指引,阻塞事件
        this.tableManager.handleLocalPacket(CoursePackData['BANKER']); //成为庄家
        this.scheduleOnce(function() {
            this.tableManager.handleLocalPacket(CoursePackData['PLAYERBEI2']); //闲家叫倍
            this.tableManager.handleLocalPacket(CoursePackData['FIVEPOKER']); //第五牌
        }, 2);
        this.scheduleOnce(function() {//弹出提示指引(阻塞)
            var page = this.coursePage.updatePage(8);
            var btn = cc.find("Canvas/Table/SelfSeat/ResultPanel/Layout/Btn0");
            if(btn){
                btn.maskEvent = this.startSend3.bind(this);
                page.getComponent('MaskLayer').addMaskNode(btn);
            }
        }, 3);
        return false;
    },
    //用户点击有牛按钮后
    startSend3:function(){
        this.coursePage.updatePage(11); //关闭指引,阻塞事件
        this.scheduleOnce(function() {
            this.tableManager.handleLocalPacket(CoursePackData['OK']); //闲家OK
            this.tableManager.handleLocalPacket(CoursePackData['GAMEOVER']); //闲家OK
            this.coursePage.updateNewUser(); //更新用户状态
        }, 2);
        this.scheduleOnce(function() {
            var page = this.coursePage.updatePage(9);
            var btn = cc.find("Canvas/Table/Back");
            if(btn){
                btn.maskEvent = this.startSend4.bind(this);
                page.getComponent('MaskLayer').addMaskNode(btn);
            }
        }, 4);
        return false;
    },
    //用户点击返回按钮
    startSend4:function(){
        this.coursePage.endCourseTable();//结束新手教程桌面场景
        return true;
    }

});