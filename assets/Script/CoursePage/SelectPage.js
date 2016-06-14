cc.Class({
    extends: cc.Component,

    properties: {
        selectIndex:0, //0第一副牌， 1第二副牌
        selects:[cc.Node],
    },
    onLoad: function () {
        this.updateSelect();
    },
    //处理点击选择的结果
    handleClick:function(){
        if(this.selectIndex == 1){ //false
            console.log('选择错误');
            return;
        }
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
});
