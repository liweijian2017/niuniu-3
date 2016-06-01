//倒计时组件
cc.Class({
    extends: cc.Component,

    properties: {
        number:{
            default:null,
            type:cc.Label
        },
        timeOut:5,
        flag:true,
    },
     
    begin:function(time, cb){
        var self = this;
        var time = time
        if(self.number){
            self.number.string = time;
        }
        function timer()  {
            if(!self.flag)return;
            time --;
            if(time === 0) {
                if(cb)cb();
                return;  
            }
            if(self.number){
                self.number.string = time;
            }
            setTimeout(timer,1000); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒  
        }
        timer();
    },
    
    onDestroy:function () {
        this.flag = false;
    }
    
});
