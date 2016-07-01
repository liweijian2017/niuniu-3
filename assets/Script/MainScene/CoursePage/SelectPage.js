var CoursePage = require('CoursePage');
cc.Class({
    extends: cc.Component,

    properties: {
        coursePage:{
            default:null,
            type:CoursePage
        },
        hint:{ //错误提示
            default:null,
            type:cc.Node
        },
        selectIndex:0, //0第一副牌， 1第二副牌
        selects:[cc.Node],
    },
    onLoad: function () {
        this.updateSelect();
        this.hint.active = false;
    },
    //处理点击选择的结果
    handleClick:function(){
        if(this.selectIndex == 1){ //false
            this.coursePage.handelNext(); //进入下一步
            return;      
        }
        this.showHint();
    },
    selectOne:function(){
        this.selectIndex = 0;
        this.updateSelect();
    },
    selectTwo:function(){
        this.selectIndex = 1;
        this.updateSelect();
    },
    updateSelect:function(){
        for(var i=0; i<this.selects.length; i++){
            var select = this.selects[i];
            if(i == this.selectIndex){
                select.active = true;
            }else {
                select.active = false;
            }
        }
    },
    //显示提示
    showHint:function(){
        this.hint.active = true;
        this.hint.getComponent('NodeTransition').show(1);
        this.hint.getComponent('NodeTransition').timingHide(1, 1.5);
    }
});
