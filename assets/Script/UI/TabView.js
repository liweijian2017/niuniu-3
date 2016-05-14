cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad: function () {
        this.node.on('switch-tab', function(event){
            var index = event.getUserData().msg;
        }, this);
    },

});
