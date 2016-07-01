// 新手教程
var Http = require('Http');
cc.Class({
    extends: cc.Component,
    properties: {
        index:-1, //-1:没有状态  -2:什么都不能点 0-length:对应的node
        pages:[cc.Node],
    },

    onLoad: function () {
        this.updatePage(this.index);
        if(!cc.game.isPersistRootNode(this.node)){
            cc.game.addPersistRootNode(this.node);
        }
    },
    //进入下一个步骤
    handelNext:function(){
        if(this.index >= this.pages.length-1)return;
        this.updatePage(++this.index);
    },
    //关闭所有的页面
    closePages:function(){
        for(var i=0; i<this.pages.length; i++){
            var page = this.pages[i];
            if(page.active){
                if(!page.getComponent('NodeTransition')){
                    page.active = false;
                    return;
                };
                page.getComponent('NodeTransition').hide();
            }
        }
    },
    //切换页面
    updatePage:function(index){
        this.closePages(); //关闭所有
        if(this.index < 0)return;
        if(this.index >= this.pages.length)return;
        this.pages[index].active = true;
        if(this.pages[index].getComponent('NodeTransition')){//执行node带有的效果
            this.pages[index].getComponent('NodeTransition').show();
            return this.pages[index];
        };
    },
    //开始教学场
    startCourseTable:function(){
        this.closePages(); //关闭所有
        cc.director.loadScene('TableScene', function(){
            this.node.getComponent('CoursePack').init();//开启发包机
        }.bind(this));//进入房间
    },
    //结束教学场,回到主界面,继续引导
    endCourseTable:function(){
        cc.director.loadScene('MainScene', function(){
            var page = this.updatePage(10);
            cc.director.getScene().getChildByName('CoursePage').removeFromParent();//移除行产生的节点
            this.node.parent = cc.director.getScene(); //常驻节点恢复
            var btn = cc.find("Canvas/MainPage/Main/RoomListBtn");
            if(btn){
                btn.maskEvent = this.endCourse.bind(this);
                page.getComponent('MaskLayer').addMaskNode(btn);
            }
        }.bind(this));//进入房间
    },
    //结束教程
    endCourse:function(){
        if(cc.game.isPersistRootNode(this.node)){
            cc.game.removePersistRootNode(this.node);
            this.node.removeFromParent();
        }
        return false;
    },

    updateNewUser:function(){
        Http.updateNewUser(this.updateUserSucceed.bind(this), function(){});
    },

    updateUserSucceed:function(){
        console.log('新手流程顺利走完');
        Http.userData.point += 10000;
        Http.userData.isNew = 0;
    },

});
