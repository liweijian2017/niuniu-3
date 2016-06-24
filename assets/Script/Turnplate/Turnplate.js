//大转盘
var FSM = require('FSM'); //有限状态机
var Http = require('Http');
cc.Class({
    extends: cc.Component,

    properties: {
        maxVr:100,//最大速度
        ar:150, //加速度
        offset:9, //便宜量
        endId:-1, //结束id
        endPoint:0, //结束获得的金币数
        endNum:5, //结束需要转几圈
        _fsm:null, 
        _ar:0, //角加速度
        _vr:0, //角速度
        _hasRs:false,
        _endId:-1, //结束id
        target:{
            default:null,
            type:cc.Node
        },
        hintPanel:{
            default:null,
            type:cc.Node
        },
        labels:[cc.Label],
        pointLabel:{
            default:null,
            type:cc.Label
        },
        highLight:{ //高亮
            default:null,
            type:cc.Node
        },
        moneyParPrefab:{
            default:null,
            type:cc.Prefab
        }
    },

    onLoad: function () {
        this._fsm = FSM.create({//创建状态机
            initial: 'waiting', 
            events: [
                { name: 'run',  from: 'waiting',  to: 'accelerating' }, //开始加速
                { name: 'keep',  from: 'accelerating',  to: 'constanting' }, //不再加速,保持匀速
                { name: 'slow',  from: 'constanting',  to: 'decelerating' }, //减速
                { name: 'end',  from: 'decelerating',  to: 'waiting' }, //最后的运动
　　　　　　],
            callbacks: {
                onrun:this._onRun.bind(this),
                onkeep:this._onKeep.bind(this),
                onslow:this._onSlow.bind(this),
                onend:this._onEnd.bind(this),
            }
        });
    },

    initConfig:function(data){// 加载数组前8
        for(var k in this.labels){
            this.labels[k].string = data[k].num;
        }
    },

    update: function (dt) {
        this._vr += this._ar*dt; //v = a*dt
        if(this._vr > this.maxVr){//达到最大速度,保持匀速
            this._fsm.keep(); 
        }
        this.target.rotation += this._vr*dt;//s=v*dt
        if(this._fsm.is('decelerating') && this._vr < 0){ //end
            this._fsm.end();
        }
        if(this._hasRs && this._fsm.is('constanting') && (this.target.rotation%360 >= this._getRById()) ) { //什么时候开始减速
            this._fsm.slow();
        }
    },

    //开始
    begin:function(){
        if(this.endId != -1)return;
        Http.loginWheel(function(data){//data = {index:2, point:2000}
            console.log(data);
            this.endId = data.index;
            this.endPoint = data.point;
            if(this._fsm.can('run'))
                this._fsm.run(); //开始旋转
        }.bind(this), function(data){
            if(data.ret == 1) {
                console.log('今日已经领取!');
            }
        });
    },

    //开始加速
    _onRun:function(){
        this._ar = this.ar;
        this.highLight.active = false;
    },

    //开始匀速
    _onKeep:function(){
        this._vr = this.maxVr;
        this._ar = 0;
        this.scheduleOnce(function(){
            //模拟接到请求了
            this._setEndId(this.endId);
            this._hasRs = true;
        }, 1);
    },
    _onSlow:function(){ //减速
        this.target.rotation = this._getRById(); //调整位置
        // console.log('现实减速角度 : ' + this.target.rotation%360);
        this._ar = this._getArById();
    },
    //开始减速
    _onEnd:function(){
        console.log('现实结束角度:' + this.target.rotation%360);
        this.highLight.active = true;
        this.target.rotation = this._getRById();
        this._ar = 0;
        this._vr = 0;
        this.hintPanel.active = true;
        this.hintPanel.getComponent('NodeTransition').show();
        this.node.addChild(cc.instantiate(this.moneyParPrefab));
        this.hintPanel.getComponent('NodeTransition').timingHide(null, 2, function(){
            this.node.getComponent('NodeTransition').hide();
            Http.userData.point += this.endPoint;
        }.bind(this));

    },
    //理论应该结束的角度
    _getRById:function(){
        if(this._endId < 0)return 400; //永远不成功
        return this._endId*(360/this.labels.length);
    },
    //根据id计算减速度
    _getArById:function(){
        if(this._endId < 0)return 0;
        var endS = 360*this.endNum + this.offset; //减速的路程
        var v1 = this._vr; //每一帧的移动位置
        // v²-v0²=2as
        // console.log('理论结束角度: ' + (this.target.rotation + endS)%360);
        var a = -(v1*v1)/(2*endS);
        return a;
    },
    _setEndId:function(id){
        // this.pointLabel.string = this.labels[id].string;
        this.pointLabel.string = this.endPoint;
        this._endId = id == 0 ? 0 : (8-id);
    },
});
