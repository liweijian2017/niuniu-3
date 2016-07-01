//排行榜和财富榜
var FSM = require('FSM'); //有限状态机
var Http = require('Http');

cc.Class({
    extends: cc.Component,

    properties: {
        scoreBtn:{
            default:null,
            type:cc.Button
        },
        richBtn:{
            default:null,
            type:cc.Button
        }
    },

    onLoad: function () {
        this.fsm = FSM.create({//创建状态机
            initial: 'StateRich',
            events: [
    　　　　　　{ name: 'openScore',  from: 'StateRich',  to: 'StateScore' },
    　　　　　　{ name: 'openRich', from: 'StateScore', to: 'StateRich' },
　　　　　　],
            callbacks: {
                onenterStateRich:this.initRichList.bind(this),
                onleaveStateRich:this.onleaveStateRich.bind(this),

                onenterStateScore:this.initScoreList.bind(this),
                onleaveStateScore:this.onleaveStateScore.bind(this),
            }
        });
        // this.fsm.warn();
    },
    //加载财富榜
    initRichList:function(){
        var listView = this.getComponent('ListView');
        Http.getTop(function(data){
            listView.initializeForData(data.list);
        }, function(err){
            // console.err(err);
        });
        this.richBtn.getComponent(cc.Button).interactable = false;
    },
    //加载积分榜
    initScoreList:function(){
        var listView = this.getComponent('ListView');
        Http.getScoreTop(function(data){
            listView.initializeForData(data.list);
        }, function(err){
            // console.err(err);
        });
        this.scoreBtn.getComponent(cc.Button).interactable = false;
    },
    changeToRich:function(){
        if(this.fsm.can('openRich'))
            this.fsm.openRich();
    },
    changeToScore:function(){
        if(this.fsm.can('openScore'))
            this.fsm.openScore();
    },
    //离开积分排行榜
    onleaveStateScore:function(){
        this.scoreBtn.getComponent(cc.Button).interactable = true;
    },
    //离开财富排行榜
    onleaveStateRich:function(){
        this.richBtn.getComponent(cc.Button).interactable = true;
    }

});
