var UserComponent = require('UserComponent');
var BaseComponent = require('BaseComponent');
var HundredData = require('HundredData');
cc.Class({
    extends: BaseComponent,

    properties: {
        _data:null,
        items:[UserComponent],
        winLabel:{
            default:null,
            type:cc.Node
        },
        loseLabel:{
            default:null,
            type:cc.Node
        }
    },

    onLoad: function () {
        this._isChange = true;
        this._data = {
            type:0, //0:赢, 1:输
            list:[
                {name:'我', point:1110, img:''},
                {name:'one', point:110, img:''},
                {name:'two', point:-10, img:''},
                {name:'three', point:3330, img:''},
                {name:'four', point:-9999, img:''},
            ]
        };
    },

    onEnable:function(){
        if(HundredData['winnersList'])
            this.init(HundredData['winnersList']);
    },

    //初始化数据
    init:function(data){
        var arr = [];
        var t = 0;
        for(var k in data){
            if(data[k].uid  == Http.userData.uid){ //自己
                arr.push({name:data[k].nick, point:data[k].chips, img:data[k].img});
            }
        }
        for(var k in data){
            if(data[k].uid  != Http.userData.uid){
                arr.push({name:data[k].nick, point:data[k].chips, img:data[k].img});
            }
        }
        this._data = {
            type:t,
            list:arr
        };
        this._updateNode();
    },

    _updateNode:function(){
        this._parseData(this._data);
    },

    _parseData:function(data){
        if(data.type == 0){ 
            this.winLabel.active = true;
            this.loseLabel.active = false;
        }else {
            this.winLabel.active = false;
            this.loseLabel.active = true;
        }
        for(var k in this.items){
            if(data.list[k]){
                this.items[k].node.active = true;
                this.items[k].setUserData(data.list[k].name, data.list[k].point, data.list[k].img);
            }else {
                this.items[k].node.active = false;
            }
        }
    },
});
