cc.Class({
    extends: cc.Component,

    properties: {
       handSeat:{
            default:null,
            type:cc.Node
       },
       labels:{
           default:[],
           type:[cc.Label]
       },
       numbers:[], //选中的poker值
       but0:{
           default:null,
           type:cc.Button
       },
       but1:{
           default:null,
           type:cc.Button
       }
    },

    onLoad: function () {

    },
    //刷新显示结果
    addPoker:function (num) {
        if(num > 0){ //添加数字
            if(this.numbers.length >= 3){
                console.log("已经选择了3个了,不能再选择");
                return; //已经到达3个则不操作
            }else {
                this.numbers.push(num);
            }
        }else { //移除数字
            if(3 == this.numbers.length){//当前状态是3
                this.handSeat.getComponent('HandPoker').addPokerTouch();
                //禁用有牛按钮
                this.but0.getComponent(cc.Button).interactable = true;
            }
            var index = this.numbers.indexOf(-num);
            this.numbers.splice(index, 1);
        }
        //计算结果
        var count = 0;
        for(var i=0; i<this.numbers.length; i++){
            count+=this.numbers[i];
        }
        //更新显示
        this.updateLabels();
        this.labels[3].string = count;
        //判断结果
        if( 3 == this.numbers.length){
            if(this.isNiu(this.numbers)){//修改按钮状态
                this.but0.getComponent(cc.Button).interactable = true;
            }
            if(count%10 == 0) {//'有牛'//修改按钮状态
                this.but0.getComponent(cc.Button).interactable = true;
            }
            //关闭事件
            this.handSeat.getComponent('HandPoker').removePokerTouch();
        }
    },
    updateLabels:function () {
        for(var i=0; i<3; i++){
            if(i < this.numbers.length){
                this.labels[i].string = this.numbers[i];
            }else {
                this.labels[i].string = 0;
            }
        }
    },
    //清空计算框
    clearAll:function () {
        this.numbers = [];
        this.labels[3].string = 0+'';
        this.updateLabels();
    },
    
    isNiu:function (arr) {
        var one = arr[0];
        for(var i=0; i<arr.length; i++){
            if(arr[i] != one){ //一旦发现不相等
                return false;                
            }
        }
        return true;
    }
});