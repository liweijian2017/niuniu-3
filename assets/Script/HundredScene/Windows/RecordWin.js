var BaseComponent = require('BaseComponent');
cc.Class({
    extends: BaseComponent,

    properties: {
        _data:null,
        contentNode:{
            default:null,
            type:cc.Node
        },
        winSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },
        loseSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },
    },

    onLoad: function () {
        this._isChange = true;
    },

    init:function(data){ //第一次加载数据 TODO
        if(!this._data){
            this._data = data;
            this._updateNode();
        }
    },

    _updateNode:function(){
        if(this._data) {
            this.paseData(this._data);
        }
    },
    //解析数据,更新显示
    paseData:function(data){ //解析数据 // 1:闲家胜 0:闲家输
        var children = this.contentNode.children;
        for(var i=0; i<children.length; i++){
            for(var k=0; k<children[i].children.length; k++){
                if(data[i][k] == 1) {
                    children[i].children[k].getComponent(cc.Sprite).spriteFrame = this.winSpriteFrame;
                }else {
                    children[i].children[k].getComponent(cc.Sprite).spriteFrame = this.loseSpriteFrame;
                }
            }
        }

    },

});
