//聊天消息对象
cc.Class({
    extends: cc.Component,

    properties: {
        headImg:{
            default:null,
            type:cc.Sprite
        },
        nameLabel:{
            default:null,
            type:cc.Label
        },
        content:{
            default:null,
            type:cc.Label
        },
        textPanel:{
            default:null,
            type:cc.Sprite
        }
    },

    onLoad: function () {

    },

    setContent:function(content){
        this.content.string = content;
        // this.textPanel.node.height = 18*(content.length%10);
    },

    setName:function(name){
        this.nameLabel.string = name;
    },

    setHeadImg:function(img){
        this.headImg.spriteFrame = img;
    },

    updateHeight:function(){
        this.textPanel.node.height = this.content.node.height + 10;
    },
});
