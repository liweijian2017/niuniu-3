var BaseComponent = require('BaseComponent');
var Util = require('Util');
cc.Class({
    extends: BaseComponent,

    properties: {
        id:-1, //座位id
        _isHold:false, //座位上是否有人
        _nameStr:'', //座位上的人
        _imgUrl:'',//头像地址
        _point:0, //筹码数
        _oldPoint:0,
    },

    onLoad: function () {
        this._isChange = true;
        console.log('百人场-初始化座位:' + this.id);
        this.nameLabel = this.node.getChildByName('name');
        this.pointLabel = this.node.getChildByName('point');
        this.imgSprite = this.node.getChildByName('img');
        this.nullSprite = this.node.getChildByName('null');
        this.node.on(cc.Node.EventType.TOUCH_END, this._handleClick.bind(this), this);
    },

    _updateNode:function(){
        if(!this._isHold){
            this.nameLabel.active = false;
            this.pointLabel.active = false;
            this.imgSprite.active = false;
            this.nullSprite.active = true;
            return;
        }else{
            this.nameLabel.active = true;
            this.pointLabel.active = true;
            this.imgSprite.active = true;
            this.nullSprite.active = false;
        }
        if(this._nameStr)
            this.nameLabel.getComponent(cc.Label).string = Util.formatName(this._nameStr, 6);
        if(this._point != this._oldPoint){
            this.pointLabel.getComponent(cc.Label).string = Util.bigNumToStr(this._point);
            //TODO 数值浮动
            this._oldPoint = this._point;
        }
    },
    //坐下
    sitDown:function(data){
        this._isHold = true;
        this._nameStr = data.name;
        this._point = data.point;
        this._imgUrl = data.img;
        this._updateNode();
        //加载头像 TODO 
        //执行动画
        this.nameLabel.y += 30;
        this.nameLabel.runAction(cc.moveBy(0.5, 0, -30).easing(cc.easeBackOut()));
        this.imgSprite.y += 30;
        this.imgSprite.runAction(cc.moveBy(0.5, 0, -30).easing(cc.easeBackOut()));
        this.pointLabel.y += 30;
        this.pointLabel.runAction(cc.moveBy(0.5, 0, -30).easing(cc.easeBackOut()));
    },
    //站起
    standUp:function(){
        this._isHold = false;
        this._nameStr = '';
        this._point = 0;
        this._imgUrl = '';
        
        this.nameLabel.runAction(cc.moveBy(0.5, 0, 30).easing(cc.easeBackOut()));
        this.imgSprite.runAction(cc.moveBy(0.5, 0, 30).easing(cc.easeBackOut()));
        this.pointLabel.runAction(cc.moveBy(0.5, 0, 30).easing(cc.easeBackOut()));
        
        this.scheduleOnce(function(){
            this._updateNode(); //刷新显示
            this.nameLabel.y -= 30;
            this.imgSprite.y -= 30;
            this.pointLabel.y -= 30;
        } ,0.2);

    },
    //申请坐下
    _handleClick:function(event){
        if(!this._isHold){
            console.log('百人场-申请坐下:' + this.id);
            this.sitDown({name:'Dall', point:1000, img:''});
        }else {
            this.standUp();
        }
    },
});
