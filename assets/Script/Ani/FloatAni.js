cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {

    },

    start:function(){
        var action = cc.moveBy(0.5, cc.p(0, 25));
        var action2 = cc.moveBy(0.5, cc.p(0, -25));
        this.node.runAction(cc.repeatForever(cc.sequence(action, action2)));
    },
});
