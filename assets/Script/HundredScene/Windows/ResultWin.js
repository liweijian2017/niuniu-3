var UserComponent = require('UserComponent');
var BaseComponent = require('BaseComponent');
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
    //初始化数据
    init:function(data){
        this._data = data;
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
            this.items[k].setUserData(data.list[k].name, data.list[k].point, data.list[k].img);
        }
    },

});
