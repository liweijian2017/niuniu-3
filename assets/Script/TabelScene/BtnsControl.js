//倍数选择框
cc.Class({
    extends: cc.Component,

    properties: {
        btns:{ //按钮容器
            default:[],
            type:[cc.Button]
        }
    },

    onLoad: function () {

    },

    start:function(){
        this.node.active = false;
    },

    //显示
    show:function(num){
        for(var i=0; i<this.btns.length; i++){
            if(this.btns[i].getComponent('SelectButton').id<=num){
                this.btns[i].interactable = true;
                continue;
            }
            this.btns[i].interactable = false;
        }
    },

    hide:function(){

    }

});
