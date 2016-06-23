//大转盘
var FSM = require('FSM'); //有限状态机
cc.Class({
    extends: cc.Component,

    properties: {
        maxVr:100,
        _fsm:null,
        _ar:0, //角加速度
        _vr:0, //角速度
        target:{
            default:null,
            type:cc.Node
        }
    },

    onLoad: function () {
         this._fsm = FSM.create({//创建状态机
            initial: 'waiting', 
            events: [
                { name: 'run',  from: 'waiting',  to: 'accelerating' }, //开始加速
                { name: 'keep',  from: 'accelerating',  to: 'constanting' }, //不再加速,保持匀速
                { name: 'end',  from: 'constanting',  to: 'waiting' }, //最后的运动
　　　　　　],
            callbacks: {
                onrun:this._onRun.bind(this),
                onkeep:this._onKeep.bind(this),
                onend:this._onEnd.bind(this),
            }
        });
    },

    update: function (dt) {
        if(this._ar != 0)
            this._vr += this._ar;
        if(this._vr > this.maxVr){//达到最大速度,保持匀速
            this._vr = this.maxVr;
            this._fsm.keep(); 
        }
        if(this._fsm.is('waiting') && this._vr <= 0){ //结束点
            this._vr = 0;
            this._ar = 0;
            this.showResult();
        }
        if(this._vr != 0){
            this.target.rotation += this._vr;
        }
    },

    //开始
    begin:function(){
        if(this._fsm.can('run'))
            this._fsm.run(); //开始旋转
    },
    //结束
    showResult:function(){ //停止
        // console.log('转盘结束');
    },

    //开始加速
    _onRun:function(){
        this._ar = 0.1;
    },

    //开始匀速
    _onKeep:function(){
        this._ar = 0;
        var self = this; 
        setTimeout(function(){
            self._fsm.end();
        }, 2000);
    },
    //开始减速
    _onEnd:function(){
        this._ar = -0.1;
    }
});
