// 新手教程

cc.Class({
    extends: cc.Component,
    properties: {
        index:0, //当前步骤
        pages:[cc.Node],
    },

    onLoad: function () {
        this.updatePage(this.index);
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
        if(this.index >= this.pages.length)return;
        this.closePages();
        this.pages[index].active = true;
        if(this.pages[index].getComponent('NodeTransition')){//执行node带有的效果
            this.pages[index].getComponent('NodeTransition').show();
            return;
        };
    },
    //移动进入
    moveIn:function(node){
        node.x = 500;
        var move = cc.moveTo(0.5, cc.p(0,0)).easing(cc.easeBackOut());
        node.runAction(move);
    },
    //移动消失
    moveOut:function(node, cb){
        var move = cc.moveTo(0.4, cc.p(-500,0)).easing(cc.easeBackOut());
        node.runAction(cc.sequence(move, cc.callFunc(cb, this)));
    }

});
