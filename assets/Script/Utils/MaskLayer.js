cc.Class({
    extends: cc.Component,

    properties: {
        maskNodes:[cc.Node],
    },

    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.TOUCH_END, this); //添加遮罩
    },

    TOUCH_END:function(event){
        if(this.maskNodes.length == 0)return;        
        for(var i=0; i<this.maskNodes.length; i++){
            if(this._isClick(this.maskNodes[i], event.getLocation())) {
                this._handlerEvent(this.maskNodes[i]);
            }
        };
    },

    _isClick:function(node, loc){
        var ccRect = node.getBoundingBoxToWorld();
        if(this._isInRect(ccRect, loc)) {
            return true;
        }
        return false;
    },

    //处理节点上的按钮事件
    _handlerEvent:function(btnNode){
        if(btnNode.maskEvent)if(btnNode.maskEvent())return;
        var clickevents = btnNode.getComponent(cc.Button).clickEvents;
        if(!clickevents)return;
        for(var i=0; i<clickevents.length; i++){
            var clickevent = clickevents[i], 
            node = clickevent.target,
            callFun = node.getComponent(clickevent.component)[clickevent.handler];
            if(typeof(callFun) == 'function')callFun.call(node.getComponent(clickevent.component));
        }
        // this.node.parent.getComponent('CoursePage').handelNext(); //进入教程下一步
    },
    //判断点是否在矩形内
    _isInRect:function(rect, p){
        if(rect.x < p.x && p.x < rect.x+rect.width && rect.y < p.y && p.y < rect.y + rect.height){
            return true;
        }else {
            return false;
        }
    },

    addMaskNode:function(node){
        this.maskNodes.push(node);
    },

});
