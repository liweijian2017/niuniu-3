var BaseComponent = require('BaseComponent');
cc.Class({
    extends: BaseComponent,

    properties: {
        cardUint:0x010A,
        touchEvent:null,
        type:1, //花色
        value:2, //数值
        scale:1, //缩放比例
        isMoving:false,  //是否在移动中(暂时未使用到该属性)
        isSelect:false, //是否被选中
        isActive:true, //激活状态才能响应点击事件
        show:false,
        back:{
          default:null,
          type:cc.Sprite  
        },
        background:{
          default:null,
          type:cc.Sprite  
        },
        spriteAtlas: { //图集
            default: null,
            type: cc.SpriteAtlas
        }, 
        valueLabel:{
            default:null,
            type:cc.Sprite
        },
        typeLabel:{
            default:null,
            type:cc.Sprite
        },
        bigTypeLabel:{
            default:null,
            type:cc.Sprite
        }
    },

    onLoad: function () {
        this.updateSprites();
        this.touchEvent = function (event) {
            if(!this.isMoving){ //没有在移动中往上移动10单位
                var move = null;
                var event =  new cc.Event.EventCustom('COUNT_POKER', true);
                if(this.isSelect){ //是否被选中
                    move = cc.moveBy(0.1, 0, -10);
                    this.isSelect = false;
                    event.setUserData({msg:-this.value});
                }else{
                    move = cc.moveBy(0.1, 0, 10);
                    this.isSelect = true;
                    event.setUserData({msg:this.value});
                }
                if(move && event){
                    this.node.runAction(move);
                    this.node.dispatchEvent(event);
                }
            }
        };
    },
    //初始化 卡牌
    init:function(cardUint){
        this.cardUint = cardUint;
        this.type = this.getVariety(this.cardUint);
        this.value = this.getValue(this.cardUint);
        if(this.value == 14)this.value = 1;
        this.updateSprites();
    },
    
    //更新显示
    updateSprites:function(){
        var typeStr = 'black';
        var typeStr2 = 'club';
        switch(this.type){
            case 1:
                typeStr = 'red';
                typeStr2 = 'diamond';
                break;
            case 2:
                typeStr = 'black';
                typeStr2 = 'club';
                break;
            case 3:
                typeStr = 'red';
                typeStr2 = 'heart';
                break;
            case 4:
                typeStr = 'black';
                typeStr2 = 'spade';
                break;
            default:break;
        }
        // var key = 'card_value_big_'+ typeStr +'_' + this.value;
        var key = 'card_value_big_'+ typeStr +'_' + (this.value==1?14:this.value);
        this.valueLabel.spriteFrame = this.spriteAtlas.getSpriteFrame(key);        
        var key2 = 'card_variety_small_'+typeStr+'_' + typeStr2;
        this.typeLabel.spriteFrame = this.spriteAtlas.getSpriteFrame(key2);
        var key3 = 'card_variety_big_' + typeStr + '_' +typeStr2;
        if(this.value > 10) {
            key3 += ('_' + this.value)
        }
        this.bigTypeLabel.spriteFrame = this.spriteAtlas.getSpriteFrame(key3);
        if(this.show){
            this.back.node.active = false;
        }else {
            this.back.node.active = true;
        }
        this.node.setScale(this.scale);
    },
    
    getValue:function(cardUint){
        return cardUint%256
    },
    
    getVariety:function(cardUint){
        return Math.floor(cardUint/256);
    },
    //设置牌是否显示
    setState:function (flag) {
        this.show = flag;
        this.updateSprites();
    },
    //添加移动点击事件
    addTouchEvent:function () {
        //判断用户是否已经存在
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
    },
    //移除poker上面所有注册的事件
    removeAllEvent:function () {
        if(this.touchEvent&&!this.isSelect){
            this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        }
    },
    //属性变动监听
    _updateNode:function(){
        this.updateSprites();
    },
});
