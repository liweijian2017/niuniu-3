var ImageLoader = require('ImageLoader');
var Util = require('Util');

cc.Class({
    extends: cc.Component,

    properties: {
        itemID: 0,   //id
        dataSource:[], //数据源
        spriteAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        nameLabel:{ //名字
            default:null,
            type:cc.Label
        },
        valueLabel:{ //数值(筹码和金币)
            default:null,
            type:cc.Label
        },
        valueSprite:{
            default:null,
            type:cc.Sprite
        },
        headImg:{
            default:null,
            type:cc.Sprite
        },
        number:{
            default:null,
            type:cc.Sprite
        },
        number2:{
            default:null,
            type:cc.Label
        },
    },

    updateItem: function(tmplId, itemId) {
        this.itemID = itemId;
        if(this.dataSource.length > 0){
            var data = this.dataSource[itemId];
            this.parseData(data);
        }
        // this.label.string = 'Tmpl#' + tmplId + ' Item#' + this.itemID;
    },
    //设置数据源
    setDataSource:function(dataSource){ //数组
        this.dataSource = dataSource;
    },
    //解析数据
    parseData:function(data){
        var self = this;
        this.nameLabel.string = Util.formatName(data.name||'', 10);
        this.valueLabel.string = Util.bigNumToStr(data.point||data.score);
        if(data.image){
            ImageLoader.load(data.image, function(ret, node){
                if(ret && self.headImg) {
                    self.headImg.getComponent(cc.Sprite).spriteFrame = node.getComponent(cc.Sprite).spriteFrame;  
                }           
            });
        }
        if(this.itemID <= 2){ //显示图片
            this.number.node.active = true;
            this.number2.node.active = false;
            this.number.spriteFrame = this.spriteAtlas.getSpriteFrame('no' + (this.itemID + 1));
        }else {
            this.number2.node.active = true;
            this.number.node.active = false;
            this.number2.string = this.itemID+1;
        }

        //显示修改
        if(!data.point){
            this.valueSprite.spriteFrame = this.spriteAtlas.getSpriteFrame("icon_jifen");
        }
    },
});